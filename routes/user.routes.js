import express from 'express';
import { register, login, getUserById } from '../controllers/user.controller.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUserById); // 👈 Tambahan ini

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

export default router;
