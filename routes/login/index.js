const router = require("express").Router();
const loginController = require('./controller/loginController');

/**
 * @swagger
 * /login:
 *   get:
 *     tags: 
 *       - Sesión
 *     summary: Inicio de sesión
 *     description: Inicia la sesión del usuario.
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Inicio exitoso'
 */
router.post('/', loginController.LoginSession);

module.exports = router;

