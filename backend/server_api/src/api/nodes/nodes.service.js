// server_api/src/api/nodes/nodes.service.js
import pool from '../../config/db.js';
import axios from 'axios';
import { findOrCreateUser } from '../users/users.service.js';
import pythonApiClient from '../../utils/pythonApiClient.js';

// --- Data Fetching Service ---

/**
 * NEW: Service to find a single node by its ID.
 * This is primarily used for testing and verification of the background job.
 * @param {string} nodeId - The UUID of the node to find.
 * @returns {Promise<object|undefined>} The full node object, or undefined if not found.
 */
export const findNodeById = async (nodeId) => {
    const result = await pool.query('SELECT * FROM public.nodes WHERE id = $1', [nodeId]);
    return result.rows[0];
};


// --- Helper Functions for Context and AI Interaction ---

const CONTEXT_DEPTH = 5; // A configurable limit for how many past turns to include in the context.

/**
 * Traverses up the tree from a given node to build a conversational history.
 * @param {string} startNodeId - The ID of the node to start traversing from (the parent of the new node).
 * @returns {Promise<Array>} A promise that resolves to an array of conversation turns, ordered from oldest to newest.
 */
const buildContextHistory = async (startNodeId) => {
    let history = [];
    let currentNodeId = startNodeId;
    for (let i = 0; i < CONTEXT_DEPTH && currentNodeId; i++) {
        const result = await pool.query('SELECT user_content, ai_content, corrected_content, parent_node_id FROM public.nodes WHERE id = $1', [currentNodeId]);
        if (result.rows.length === 0) break;
        const node = result.rows[0];
        history.unshift({
            user_content: node.user_content,
            ai_content: node.corrected_content || node.ai_content
        });
        currentNodeId = node.parent_node_id;
    }
    return history;
};

/**
 * Calls the Python AI engine's /generate endpoint.
 * @param {Array} history - The conversation history.
 * @param {string} current_prompt - The user's latest prompt.
 * @returns {Promise<string>} The AI-generated content.
 */
const getAiResponse = async (history, current_prompt) => {
    const pythonApiUrl = process.env.PYTHON_AI_ENGINE_URL;
    const response = await axios.post(`${pythonApiUrl}/generate`, { history, current_prompt });
    return response.data.response;
};


// --- Main "Fast Path" Logic for Node Creation ---

/**
 * This is the primary entry point for creating a node. It orchestrates the entire asynchronous workflow.
 * 1. Creates the node and gets the AI response immediately (fast path).
 * 2. Triggers a non-blocking background job to generate the concise_context.
 * 3. Returns the newly created node to the user without waiting for the background job.
 */

export const createNode = async (nodeData) => {
    const newNode = nodeData.conversation_id
        ? await createSubsequentNode(nodeData)
        : await createNewConversationWithFirstNode(nodeData);

    // --- THIS IS THE FIX ---
    // Use the internal Docker network URL for the background task
    const internalApiUrl = process.env.NODE_SERVER_API_INTERNAL_URL;

    // Trigger the background task using the internal service URL
    axios.post(`${internalApiUrl}/api/nodes/${newNode.id}/generate-context`)
        .catch(err => {
            console.error(`[BACKGROUND_JOB_ERROR] Failed to trigger context generation for node ${newNode.id}:`, err.message);
        });

    return newNode;
};
/**
 * Helper function to create a node in an existing conversation branch.
 */
const createSubsequentNode = async ({ branch_id, parent_node_id, user_content }) => {
    const history = await buildContextHistory(parent_node_id);
    const ai_content = await getAiResponse(history, user_content);
    const parentNodeResult = await pool.query('SELECT depth FROM public.nodes WHERE id = $1', [parent_node_id]);
    const newDepth = parentNodeResult.rows[0].depth + 1;
    
    // Insert the new node. `concise_context` is initially NULL.
    const insertNodeQuery = `
        INSERT INTO public.nodes (branch_id, parent_node_id, depth, user_content, ai_content, context_for_api)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const { rows } = await pool.query(insertNodeQuery, [branch_id, parent_node_id, newDepth, user_content, ai_content, JSON.stringify(history)]);
    const branchInfo = await pool.query('SELECT conversation_id FROM public.branches WHERE id = $1', [branch_id]);
    rows[0].conversation_id = branchInfo.rows[0].conversation_id;
    return rows[0];
};

/**
 * Helper function to create the first node, which also creates the user, conversation, and main branch.
 */
const createNewConversationWithFirstNode = async ({ user_email, user_content }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // findOrCreateUser now only takes the email.
        await findOrCreateUser(user_email, client);

        const title = user_content.substring(0, 50) + (user_content.length > 50 ? '...' : '');
        
        // Insert into conversations using the user_email into the `user_email_id` column.
        const convResult = await client.query('INSERT INTO public.conversations (user_email_id, title) VALUES ($1, $2) RETURNING id;', [user_email, title]);
        const newConversationId = convResult.rows[0].id;

        const branchResult = await client.query('INSERT INTO public.branches (conversation_id, name) VALUES ($1, $2) RETURNING id;', [newConversationId, 'main']);
        const newBranchId = branchResult.rows[0].id;
        
        const ai_content = await getAiResponse([], user_content);
        
        const nodeQuery = `
            INSERT INTO public.nodes (branch_id, parent_node_id, depth, user_content, ai_content, context_for_api)
            VALUES ($1, NULL, 0, $2, $3, '[]')
            RETURNING *;
        `;
        const nodeResult = await client.query(nodeQuery, [newBranchId, user_content, ai_content]);
        const newNode = nodeResult.rows[0];
        
        await client.query( 'UPDATE public.branches SET base_node_id = $1 WHERE id = $2',
                            [newNode.id, newBranchId] );

        await client.query('COMMIT');
        
        newNode.conversation_id = newConversationId;
        return newNode;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in transaction for new conversation:', error);
        throw error;
    } finally {
        client.release();
    }
};

// --- Background Task Logic ---

/**
 * Handles the background job of generating and saving the concise context.
 * This function is called by the internal API endpoint, not directly by the user.
 * @param {string} nodeId - The ID of the node to process.
 */

export const generateAndSaveConciseContext = async (nodeId) => {
    const nodeRes = await pool.query('SELECT user_content, ai_content FROM public.nodes WHERE id = $1', [nodeId]);
    if (nodeRes.rows.length === 0) {
        throw new Error(`Node with ID ${nodeId} not found.`);
    }
    const { user_content, ai_content } = nodeRes.rows[0];

    // --- REFACTORED ---
    // Use the pre-configured client for the summarization call as well
    const summaryRes = await pythonApiClient.post('/summarize-turn', {
        user_prompt: user_content,
        ai_response: ai_content
    });
    const concise_context = summaryRes.data.concise_context;

    await pool.query('UPDATE public.nodes SET concise_context = $1 WHERE id = $2', [concise_context, nodeId]);
    console.log(`✅ Successfully generated and saved concise context for node ${nodeId}`);
};