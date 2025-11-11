// src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Crear pedido
router.post('/', pedidoController.createPedido);

// Obtener un pedido por ID
router.get('/:id', pedidoController.getPedido);

// Listar pedidos de un usuario
router.get('/usuario/:usuarioId', pedidoController.listPedidosByUser);

// Actualizar parcialmente un pedido (por ejemplo, notas, envío, etc.)
router.patch('/:id', pedidoController.patchPedido);

// Actualizar solo el estado del pedido (pendiente, pagado, enviado...)
router.patch('/:id/estado', pedidoController.updateEstado);

// Eliminar un pedido
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;
