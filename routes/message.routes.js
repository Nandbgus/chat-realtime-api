// routes/message.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { sendMessage, getMessagesByChatId, updateMessage, deleteMessage } from '../controllers/message.controller.js';

const router = express.Router();

// ✅ Route untuk mengirim pesan (POST /api/messages/:chatId)
router.post('/:chatId', authenticate, sendMessage);

// ✅ Route untuk mengambil semua pesan dalam chat tertentu
router.get('/:chatId', authenticate, getMessagesByChatId);

// routes/message.routes.js
router.put('/:messageId', authenticate, updateMessage);      // 🔧 Edit pesan
router.delete('/:messageId', authenticate, deleteMessage);   // 🗑️ Hapus pesan

export default router;
