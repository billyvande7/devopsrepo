import express from 'express';
import axios from 'axios';

const router = express.Router();

// Basic health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'core-service'
    });
});

// Detailed health check including dependencies
router.get('/health/detailed', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'core-service',
        dependencies: {
            authService: 'unknown',
            database: 'unknown'
        }
    };

    try {
        // Check Auth Service
        await axios.get(`${process.env.AUTH_SERVICE_URL}/health`);
        health.dependencies.authService = 'healthy';
    } catch (error) {
        health.dependencies.authService = 'unhealthy';
        health.status = 'degraded';
    }

    try {
        // Check database by importing and using the db instance
        const { db } = await import('../db/database.js');
        await db.get('SELECT 1');
        health.dependencies.database = 'healthy';
    } catch (error) {
        health.dependencies.database = 'unhealthy';
        health.status = 'degraded';
    }

    const httpStatus = health.status === 'healthy' ? 200 : 503;
    res.status(httpStatus).json(health);
});

export default router; 