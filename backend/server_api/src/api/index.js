// server_api/src/api/index.js
import express from 'express';
import conversationRoutes from './conversations/conversations.routes.js';
import branchRoutes from './branches/branches.routes.js';
import nodeRoutes from './nodes/nodes.routes.js';

const router = express.Router();

// Health check for the API
router.get('/', (req, res) => {
    res.status(200).json({ message: 'API is alive and kicking!' });
});

// Mount the feature-specific routers
router.use('/conversations', conversationRoutes);
router.use('/branches', branchRoutes);
router.use('/nodes', nodeRoutes);

export default router;
