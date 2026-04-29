// src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /api/pedidos/mis-pedidos:
 *   get:
 *     summary: Llistar pedidos de l'usuari autenticat
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista de pedidos
 */
router.get('/mis-pedidos', authMiddleware, pedidoController.listMisPedidos);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Llistar tots els pedidos (Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Llista de tots els pedidos
 */
router.get('/', authMiddleware, roleMiddleware('administrador'), pedidoController.listAllPedidos);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nou pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productos
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: ID de l'usuari
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               codigo_postal:
 *                 type: string
 *               telefono:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *                 enum: [tarjeta, paypal, transferencia, contrareembolso, otros]
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - nombre_producto
 *                     - cantidad
 *                     - precio_unitario
 *                   properties:
 *                     nombre_producto:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *                       minimum: 1
 *                     precio_unitario:
 *                       type: number
 *                       minimum: 0
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creat correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Dades invàlides
 */
router.post('/', pedidoController.createPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtenir un pedido per ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido trobat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no trobat
 */
router.get('/:id', pedidoController.getPedido);

/**
 * @swagger
 * /api/pedidos/usuario/{usuarioId}:
 *   get:
 *     summary: Llistar pedidos d'un usuari
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'usuari
 *     responses:
 *       200:
 *         description: Llista de pedidos de l'usuari
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */
router.get('/usuario/:usuarioId', pedidoController.listPedidosByUser);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   patch:
 *     summary: Actualitzar parcialment un pedido
 *     tags: [Pedidos]
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
 *               notas:
 *                 type: string
 *               direccion:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido actualitzat
 *       404:
 *         description: Pedido no trobat
 */
router.patch('/:id', pedidoController.patchPedido);

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     summary: Actualitzar l'estat del pedido
 *     tags: [Pedidos]
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
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, pagado, enviado, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estat del pedido actualitzat
 *       404:
 *         description: Pedido no trobat
 */
router.patch('/:id/estado', pedidoController.updateEstado);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedidos]
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
 *         description: Pedido eliminat
 *       404:
 *         description: Pedido no trobat
 */
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;
