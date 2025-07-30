// D:/Synapse/backend/server_api/src/api/users/users.service.js
import pool from '../../config/db.js';

/**
 * Finds a user by their email, or creates them if they do not exist.
 * @param {string} emailId - The user's email, which is now the primary key.
 * @param {pg.Client} [client=pool] - Optional database client for transactions.
 * @returns {Promise<object>} The found or newly created user object.
 */
export const findOrCreateUser = async (emailId, client = pool) => {
    try {
        // Check if the user exists using their email.
        let userResult = await client.query('SELECT * FROM public.users WHERE email_id = $1', [emailId]);

        if (userResult.rows.length > 0) {
            // User found, return them.
            return userResult.rows[0];
        } else {
            // User not found, create them.
            const insertQuery = `
                INSERT INTO public.users (email_id, username)
                VALUES ($1, $2)
                RETURNING *;
            `;
            // Use the part of the email before the '@' as a username.
            const username = emailId.split('@')[0];
            const newUserResult = await client.query(insertQuery, [emailId, username]);
            return newUserResult.rows[0];
        }
    } catch (error) {
        console.error('Error in findOrCreateUser:', error);
        throw error;
    }
};