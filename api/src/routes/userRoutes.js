// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registre d'usuari (ruta legacy)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - contraseña
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuari registrat
 *       400:
 *         description: Dades invàlides
 */
router.post('/register', userController.registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login d'usuari (ruta legacy)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - contraseña
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcte
 *       401:
 *         description: Credencials incorrectes
 */
router.post('/login', userController.loginUser);

// Alias route (no swagger doc needed)
router.post('/hogin', userController.loginUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Llistar tots els usuaris
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista d'usuaris
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autoritzat
 */
router.get('/', userController.listUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtenir un usuari per ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Usuari trobat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuari no trobat
 */
router.get('/:id', userController.getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualitzar parcialment un usuari
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               email:
 *                 type: string
 *               teléfono:
 *                 type: string
 *               dirección:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuari actualitzat
 *       404:
 *         description: Usuari no trobat
 */
router.patch('/:id', userController.patchUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuari
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuari eliminat
 *       404:
 *         description: Usuari no trobat
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;