import express from 'express';
import axios from 'axios';
// import pool from '../db.js'; // Uncomment and adjust if you re-enable database insertion

const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required and must be a string' });
    }
    try {
        const response = await axios.post('http://python:5000/summarize', { text });
        const summary = response.data.summary;
        console.log('Summary:', summary);
        // Temporarily disabled database insertion for testing
        // const query = 'INSERT INTO summaries(original_text, summary) VALUES($1, $2) RETURNING *';
        // const values = [text, summary];
        // const dbResult = await pool.query(query, values);
        res.status(200).json({ summary });
    } catch (error) {
        console.error('❌ Error summarizing text:', error.message);
        res.status(500).json({ error: 'Failed to summarize text' });
    }
});

export default router; // Change to default export