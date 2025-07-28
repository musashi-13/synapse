// server_api/src/api/branches/branches.controller.js
import * as branchesService from './branches.service.js';

/**
 * Handles the HTTP request to create a new branch.
 */
export const postBranch = async (req, res, next) => {
    try {
        const { conversation_id, base_node_id, name } = req.body;

        // Basic validation
        if (!conversation_id || !base_node_id || !name) {
            return res.status(400).json({
                error: 'Missing required fields: conversation_id, base_node_id, and name are required.'
            });
        }
        
        // In a real app, you would also verify that the user owns this conversation.

        const newBranch = await branchesService.createBranch({ conversation_id, base_node_id, name });
        
        res.status(201).json(newBranch);

    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
};
