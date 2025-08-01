// server_api/src/api/conversations/conversations.routes.js
import express from 'express';
import * as conversationsController from './conversations.controller.js';

const router = express.Router();

// Route to get all conversations for the authenticated user
// GET /api/conversations
router.get('/', conversationsController.getAllConversations);

// Route to create a new conversation
// POST /api/conversations
router.post('/', conversationsController.postConversation);

export default router;
