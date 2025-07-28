// server_api/src/api/branches/branches.routes.js
import express from 'express';
import * as branchesController from './branches.controller.js';

const router = express.Router();

// Route to create a new branch from a node
// POST /api/branches
router.post('/', branchesController.postBranch);

export default router;
