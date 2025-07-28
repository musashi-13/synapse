// server_api/src/index.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './api/index.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware Setup ---

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Log HTTP requests in 'dev' format
app.use(morgan('dev'));

// --- API Routes ---

// Mount the main API router under the /api prefix
app.use('/api', apiRouter);

// --- Health Check Route ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Node.js API Gateway' });
});


// --- Error Handling ---

// Catch-all for 404 Not Found errors
app.use((req, res, next) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Use the centralized error handler for all other errors
app.use(errorHandler);


// --- Start Server ---
app.listen(port, () => {
    console.log(`🚀 Node.js API Gateway listening at http://localhost:${port}`);
});
