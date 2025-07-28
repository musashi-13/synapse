// server_api/src/api/conversations/conversations.controller.js
import * as conversationsService from './conversations.service.js';

/**
 * Handles the request to get all conversations for the logged-in user.
 */
export const getAllConversations = async (req, res, next) => {
    try {
        // IMPORTANT: We are assuming a middleware has already verified the user
        // and attached the user's ID to the request object.
        // For now, we'll use a hardcoded mock ID for testing.
        const userId = req.auth?.userId || 'user_mock_id_12345'; // Replace with actual Clerk user ID from req.auth

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
        }

        const conversations = await conversationsService.findConversationsByUserId(userId);
        res.status(200).json(conversations);
    } catch (error) {
        // Pass the error to the centralized error handler
        next(error);
    }
};

/**
 * Handles the request to create a new conversation.
 */
export const postConversation = async (req, res, next) => {
    try {
        const { title } = req.body;
        const userId = req.auth?.userId || 'user_mock_id_12345'; // Replace with actual Clerk user ID

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized. User ID is missing.' });
        }

        const newConversation = await conversationsService.createConversation(userId, title);
        res.status(201).json(newConversation);
    } catch (error) {
        next(error);
    }
};
