// server_api/src/api/nodes/nodes.routes.js
import express from 'express';
import * as nodesController from './nodes.controller.js';

const router = express.Router();

// Route to create a new node (send a prompt)
// POST /api/nodes
router.post('/', nodesController.postNode);

// POST /api/nodes/:id/generate-context
router.post('/:id/generate-context', nodesController.triggerContextGeneration);

router.get('/:id', nodesController.getNodeById);

export default router;
