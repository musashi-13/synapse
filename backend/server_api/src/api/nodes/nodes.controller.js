// server_api/src/api/nodes/nodes.controller.js
import * as nodesService from './nodes.service.js';

/**
 * Handles the HTTP request to create a new node (i.e., send a new prompt).
 */
export const postNode = async (req, res, next) => {
    try {
        // Destructure all possible inputs from the request body.
        const { user_content, conversation_id, branch_id, parent_node_id, user_email: body_email } = req.body;
        
        // --- THIS IS THE CORRECTED LOGIC ---
        // In production, user info will come from `req.auth` set by Clerk middleware.
        // For testing with Postman, we allow overriding with data from the request body.
        // A final fallback mock is used if neither is present.
        const user_id = req.auth?.userId || 'user_mock_id_12345';
        const user_email = body_email || req.auth?.userEmail || 'testuser@example.com';
        // --- END OF CORRECTION ---

        if (!user_content) {
            return res.status(400).json({ error: 'user_content is required.' });
        }

        if (conversation_id && (!branch_id || !parent_node_id)) {
             return res.status(400).json({ error: 'For existing conversations, branch_id and parent_node_id are required.' });
        }

        const newNode = await nodesService.createNode({
            user_id,
            user_email, // Pass the now-guaranteed email to the service
            user_content,
            conversation_id,
            branch_id,
            parent_node_id
        });

        res.status(201).json(newNode);

    } catch (error) {
        next(error); // Pass to global error handler
    }
};

//Controller for the background task
export const triggerContextGeneration = async (req, res, next) => {
    try {
        const { id: nodeId } = req.params;
        await nodesService.generateAndSaveConciseContext(nodeId);
        // This endpoint is for internal use, so we just send a success status.
        res.sendStatus(202); // 202 Accepted: The request has been accepted for processing.
    } catch (error) {
        // We log the error but don't want to crash the app for a background task failure.
        console.error(`❌ Background task failed for node ${req.params.id}:`, error.message);
        // Send an error status back so the calling service knows it failed.
        res.status(500).json({ error: 'Failed to generate concise context.' });
    }
}

export const getNodeById = async (req, res, next) => {
    try {
        const { id: nodeId } = req.params;
        const node = await nodesService.findNodeById(nodeId);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }
        res.status(200).json(node);
    } catch (error) {
        next(error);
    }
};