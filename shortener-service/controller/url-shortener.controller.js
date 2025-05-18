import express from 'express';
import cors from 'cors';
import { UrlShortenerService } from '../service/url-shortener.service.js';
import 'dotenv/config';

const router = express.Router();
const urlShortenerService = new UrlShortenerService(process.env.AUTH_SERVICE_URL);

// CORS configuration
router.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8082',  // Use environment variable with fallback
    credentials: true,                // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Enable JSON parsing
router.use(express.json());

// Shorten URL endpoint
router.post('/api/shorten', async (req, res) => {
    try {
        const { url, customKey } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const result = await urlShortenerService.generateShortKey(url, token, customKey);
        res.json(result);
    } catch (error) {
        if (error.message === 'Custom short key is already taken') {
            return res.status(409).json({ error: error.message });
        }
        if (error.message === 'Token is required for custom short keys' || 
            error.message === 'Invalid or expired token') {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Redirect to original URL
router.get('/:shortKey', async (req, res) => {
    try {
        const { shortKey } = req.params;
        const url = await urlShortenerService.getUrl(shortKey);
        
        if (!url) {
            return res.status(404).json({ error: 'Shortened URL not found' });
        }
        
        res.redirect(url);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's URLs
router.get('/api/users/:username/urls', async (req, res) => {
    try {
        const { username } = req.params;
        const urls = await urlShortenerService.getUserUrls(username);
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 