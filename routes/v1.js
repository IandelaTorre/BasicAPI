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


router.use('/recovery-password', require('./recoveryPassword/index'));


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios.
 */
// Rutas de usuarios individualmente para tener el post de create-user como pública
router.use('/user', requestLogger, require('./users/index'));

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoint
 */
router.use('/health', verifyToken, requestLogger, require('./me/index'));

/**
 * @swagger
 * tags:
 *   name: Catalogs
 *   description: Gestión de catálogos
 */
// Rutas de catálogos protegidas y si en un futuro se implementa una consola de administración se podrían hacer públicos algunos roles para la creación de usuarios o así.
router.use('/catalogs', verifyToken, requestLogger, require('./catalogs/index'));

module.exports = router;
