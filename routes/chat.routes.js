import express from 'express';
import { createChat, getUserChats } from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createChat);
router.get('/', authenticate, getUserChats);

export default router;
