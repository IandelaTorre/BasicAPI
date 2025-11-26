const express = require('express');
const router = express.Router();

const { verifyToken } = require('../config/jwtConfig');
const { requestLogger } = require('../middlewares/requestLogger');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestión de la sesión
 */
// Login PÚBLICO
router.use('/login', require('./login/index'));

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios.
 */
// Rutas de usuarios PROTEGIDAS + con log
router.use('/user', verifyToken, requestLogger, require('./users/index'));

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoint
 */
// Si quieres que /health también requiera token y se loguee:
router.use('/health', verifyToken, requestLogger, require('./me/index'));

/**
 * @swagger
 * tags:
 *   name: Catalogs
 *   description: Gestión de catálogos
 */
router.use('/catalogs', verifyToken, requestLogger, require('./catalogs/index'));

module.exports = router;
