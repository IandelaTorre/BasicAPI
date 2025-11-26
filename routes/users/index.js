const router = require("express").Router();
const userController = require("./controller/userController");
const { verifyToken } = require("../../config/jwtConfig");
const { authorize } = require("../../middlewares/permissions")

/**
 * @swagger
 * /create-user
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Obtiene la información del usuario autenticado por uuid.
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
router.post('/create-user', userController.createUser);

/**
 * @swagger
 * /get-user
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Obtiene la información del usuario autenticado por uuid.
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
router.get('/get-user/:uuid', authorize('user.user:read'), userController.getUser);

/**
 * @swagger
 * /get-user
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Obtiene la información del usuario autenticado por uuid.
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
router.get('/get-user-by-email/:email', authorize('user.user:read'), userController.getUserByEmail);

/**
 * @swagger
 * /edit-user
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Obtiene la información del usuario autenticado por uuid.
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
router.patch('/edit-user/:uuid', authorize('user.user:write'), userController.editUser);

/**
 * @swagger
 * /delete-user
 *  get:
 *    tags:
 *      - Usuarios
 *    summary: Envia información del usuario
 *   description: Obtiene la información del usuario autenticado por uuid.
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
router.get('/delete-user/:uuid', authorize('user.user:erase'), userController.deleteUser);

module.exports = router;