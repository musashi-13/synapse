// server_api/src/api/users/users.service.js
import pool from '../../config/db.js';

/**
 * Finds a user by their ID, or creates them if they do not exist.
 * This "upsert" logic is crucial for handling first-time users.
 * @param {object} userData - The user's data.
 * @param {string} userData.id - The user's ID from the auth provider (Clerk).
 * @param {string} userData.email - The user's email.
 * @param {pg.Client} [client=pool] - Optional database client for transactions.
 * @returns {Promise<object>} The found or newly created user object.
 */
export const findOrCreateUser = async ({ id, email }, client = pool) => {
    try {
        // Check if the user already exists
        let userResult = await client.query('SELECT * FROM public.users WHERE id = $1', [id]);

        if (userResult.rows.length > 0) {
            // User found, return them
            return userResult.rows[0];
        } else {
            // User not found, create them
            const insertQuery = `
                INSERT INTO public.users (id, email, username)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            // For now, we can use the part of the email before the '@' as a username
            const username = email.split('@')[0];
            const newUserResult = await client.query(insertQuery, [id, email, username]);
            return newUserResult.rows[0];
        }
    } catch (error) {
        console.error('Error in findOrCreateUser:', error);
        throw error;
    }
};
