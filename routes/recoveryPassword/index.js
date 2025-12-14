const router = require("express").Router();
const recoveryPasswordController = require("./controller/recoveryPasswordController");

/**
 * @swagger
 * /recovery-password
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Cambia la contraseña del usuario según correo.
 *    responses: 
 *      200:
 *        description: Exito
 *        content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Hola, mundo!'
 */
router.post('/', recoveryPasswordController.recoveryPassword);



module.exports = router;