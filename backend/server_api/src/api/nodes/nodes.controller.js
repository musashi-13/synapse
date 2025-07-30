// server_api/src/api/nodes/nodes.controller.js
import * as nodesService from './nodes.service.js';

/**
 * Handles the HTTP request to create a new node (i.e., send a new prompt).
 */
export const postNode = async (req, res, next) => {
    try {
        const { user_content, conversation_id, branch_id, parent_node_id, user_email: body_email } = req.body;
        
        // We no longer need user_id. The user_email is the sole identifier.
        const user_email = req.auth?.userEmail || body_email || 'testuser@example.com';
        
        if (!user_content) {
            return res.status(400).json({ error: 'user_content is required.' });
        }

        if (conversation_id && (!branch_id || !parent_node_id)) {
             return res.status(400).json({ error: 'For existing conversations, branch_id and parent_node_id are required.' });
        }

        const newNode = await nodesService.createNode({
            // Pass user_email instead of user_id.
            user_email,
            user_content,
            conversation_id,
            branch_id,
            parent_node_id
        });

        res.status(201).json(newNode);

    } catch (error) {
        next(error);
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