// src/routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

/**
 * @swagger
 * /api/checkout/create-session:
 *   post:
 *     summary: Crear sessió de pagament amb Stripe
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Sessió creada
 *       500:
 *         description: Error de servidor
 */
router.post('/create-session', checkoutController.createSession);
router.post('/webhook', checkoutController.handleWebhook); // Requeriment 4.5

module.exports = router;
