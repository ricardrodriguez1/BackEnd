// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registre d'un nou usuari
 *     tags: [Auth]
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
 *                 example: "Raul"
 *               apellidos:
 *                 type: string
 *                 example: "Garcia"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "raul@example.com"
 *               contraseña:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuari registrat correctament
 *       400:
 *         description: Dades invàlides o correu ja registrat
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login d'usuari
 *     tags: [Auth]
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
 *                 example: "raul@example.com"
 *               contraseña:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login correcte, retorna accessToken i refreshToken
 *       401:
 *         description: Credencials incorrectes
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar el token d'accés
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIs..."
 *     responses:
 *       200:
 *         description: Nou accessToken generat
 *       401:
 *         description: RefreshToken invàlid o expirat
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout de l'usuari (invalida el refreshToken)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sessió tancada correctament
 *       401:
 *         description: No autoritzat
 */
router.post('/logout', authController.logout);

module.exports = router;
