// middlewares/requestLogger.js
const prisma = require('../config/prismaClient');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        // Si no hay usuario, no intentamos insertar porque romperíamos el FK
        const userUuid = req.user?.uuid;
        if (!userUuid) {
            return;
        }

        const duration = Date.now() - start;

        // Describe lo que pasó: método + URL + status + tiempo
        const action = `${req.method} ${req.originalUrl} [${res.statusCode}] (${duration}ms)`;

        prisma.userLog.create({
            data: {
                action,
                userUuid
            }
        }).catch(err => {
            console.error('Error al guardar log de request:', err);
        });
    });

    next();
};

module.exports = { requestLogger };
