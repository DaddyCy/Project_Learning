import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);

export default router;