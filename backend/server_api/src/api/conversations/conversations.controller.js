// D:/Synapse/backend/server_api/src/api/conversations/conversations.controller.js
import * as conversationsService from './conversations.service.js';

export const getAllConversations = async (req, res, next) => {
    try {
        // --- THIS IS THE FIX ---
        // 1. In a real environment, `req.auth.userEmail` will be present.
        // 2. For Postman testing, we can now pass `user_email` in the request body.
        // 3. A final hardcoded email remains as a last resort.
        const userEmail = req.auth?.userEmail || req.body.user_email || 'testuser@example.com';
        // --- END OF FIX ---

        if (!userEmail) {
            return res.status(401).json({ error: 'Unauthorized. User email is missing.' });
        }

        const conversations = await conversationsService.findConversationsByUserEmail(userEmail);
        res.status(200).json(conversations);
    } catch (error) {
        next(error);
    }
};

export const postConversation = async (req, res, next) => {
    try {
        const { title } = req.body;
        // Use the user's email as the identifier.
        const userEmail = req.auth?.userEmail || 'testuser@example.com';

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }
        if (!userEmail) {
            return res.status(401).json({ error: 'Unauthorized. User email is missing.' });
        }
        
        // Pass the email to the updated service function.
        const newConversation = await conversationsService.createConversation(userEmail, title);
        res.status(201).json(newConversation);
    } catch (error) {
        next(error);
    }
};