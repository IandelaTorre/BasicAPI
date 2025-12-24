const express = require('express');
const router = express.Router();
const prisma = require('../../config/prismaClient');

router.get('/', async (req, res) => {
    try {
        const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;
        
        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: {
                connected: true,
                pool: process.env.DATABASE_URL ? 'configured' : 'missing'
            },
            service: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                nodeVersion: process.version
            }
        };

        res.status(200).json(healthStatus);
    } catch (error) {
        const errorStatus = {
            status: 'error',
            timestamp: new Date().toISOString(),
            database: {
                connected: false,
                error: error.message
            },
            service: {
                uptime: process.uptime(),
                memory: process.memoryUsage()
            }
        };

        res.status(503).json(errorStatus);
    }
});

module.exports = router;
