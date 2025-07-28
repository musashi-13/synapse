// server_api/src/api/branches/branches.service.js
import pool from '../../config/db.js';

/**
  Creates a new branch in the database.
 * @param {object} branchData - The data for the new branch.
 * @param {string} branchData.conversation_id - The ID of the conversation this branch belongs to.
 * @param {string} branchData.base_node_id - The ID of the node from which this branch originates.
 * @param {string} branchData.name - The name of the branch (e.g., "Doubt about X", "Error fix").
 * @returns {Promise<object>} A promise that resolves to the newly created branch object.
 */
export const createBranch = async ({ conversation_id, base_node_id, name }) => {
    try {
        const query = `
            INSERT INTO public.branches (conversation_id, base_node_id, name)
            VALUES ($1, $2, $3)
            RETURNING id, conversation_id, base_node_id, name, status, created_at;
        `;
        const { rows } = await pool.query(query, [conversation_id, base_node_id, name]);
        return rows[0];
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error; // Re-throw to be handled by the controller
    }
};
