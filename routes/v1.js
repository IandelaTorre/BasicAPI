const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios.
 */
router.use('/user', require('./users/index'));

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestión de la sesión
 */
router.use('/login', require('./login/index'));

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoint
 */
router.use('/health', require('./me/index'));

module.exports = router;