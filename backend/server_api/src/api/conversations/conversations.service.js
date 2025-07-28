// server_api/src/api/conversations/conversations.service.js
import pool from '../../config/db.js';

/**
 * Fetches all conversations for a specific user.
 * @param {string} userId - The ID of the user (from Clerk).
 * @returns {Promise<Array>} A promise that resolves to an array of conversations.
 */
export const findConversationsByUserId = async (userId) => {
    try {
        const query = `
            SELECT id, user_id, title, created_at, updated_at
            FROM public.conversations
            WHERE user_id = $1
            ORDER BY updated_at DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching conversations by user ID:', error);
        // Re-throw the error to be caught by the controller
        throw error;
    }
};

/**
 * Creates a new conversation. This is typically done along with the first node.
 * @param {string} userId - The ID of the user creating the conversation.
 * @param {string} title - The title for the new conversation.
 * @returns {Promise<Object>} A promise that resolves to the newly created conversation object.
 */
export const createConversation = async (userId, title) => {
    try {
        // For now, we assume the user exists. We'll add user creation logic later.
        const query = `
            INSERT INTO public.conversations (user_id, title)
            VALUES ($1, $2)
            RETURNING id, user_id, title, created_at, updated_at;
        `;
        const { rows } = await pool.query(query, [userId, title]);
        return rows[0];
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};
