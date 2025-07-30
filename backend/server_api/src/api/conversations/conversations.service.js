// D:/Synapse/backend/server_api/src/api/conversations/conversations.service.js
import pool from '../../config/db.js';

/**
 * Fetches all conversations for a specific user by their email.
 * @param {string} userEmail - The email of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of conversations.
 */
export const findConversationsByUserEmail = async (userEmail) => {
    try {
        const query = `
            SELECT id, user_email_id, title, created_at, updated_at
            FROM public.conversations
            WHERE user_email_id = $1
            ORDER BY updated_at DESC;
        `;
        const { rows } = await pool.query(query, [userEmail]);
        return rows;
    } catch (error) {
        console.error('Error fetching conversations by user email:', error);
        throw error;
    }
};

/**
 * Creates a new conversation.
 * @param {string} userEmail - The email of the user creating the conversation.
 * @param {string} title - The title for the new conversation.
 * @returns {Promise<Object>} A promise that resolves to the newly created conversation object.
 */
export const createConversation = async (userEmail, title) => {
    try {
        const query = `
            INSERT INTO public.conversations (user_email_id, title)
            VALUES ($1, $2)
            RETURNING id, user_email_id, title, created_at, updated_at;
        `;
        const { rows } = await pool.query(query, [userEmail, title]);
        return rows[0];
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};