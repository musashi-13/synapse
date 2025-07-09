import express from 'express';
import cors from 'cors';
import summarizeRoutes from './routes/summarize.js';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

     // Middleware
app.use(cors());
app.use(express.json());

     // Test database connection
pool.query('SELECT NOW()', (err, res) => {
if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
}
console.log('✅ Database connected:', res.rows[0]);
});

     // Routes
app.use('/api/summarize', summarizeRoutes);

     // Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});