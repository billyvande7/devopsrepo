import express from 'express';
import cors from 'cors';
import { AuthService } from '../service/auth.service.js';
import 'dotenv/config';

const router = express.Router();
const authService = new AuthService(process.env.AUTH_SERVICE_URL);

// CORS configuration
router.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8082',  // Use environment variable with fallback
    credentials: true,                // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Enable JSON parsing
router.use(express.json());

router.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(error.message.includes('Login failed') ? 401 : 500)
           .json({ error: error.message });
    }
});

export default router; 