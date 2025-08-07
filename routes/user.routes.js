import express from 'express';
import { register, login, getUserById } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUserById); // 👈 Tambahan ini

export default router;
