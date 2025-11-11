// src/controllers/pedidoController.js
const pedidoService = require('../services/pedidoService');

/**
 * POST /api/pedidos
 */
const createPedido = async (req, res) => {
  try {
    const pedido = await pedidoService.createPedido(req.body);
    return res.status(201).json({ status: 'success', data: pedido });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error creando pedido:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/pedidos/:id
 */
const getPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidoService.getPedidoById(id);
    if (!pedido) return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
    return res.json({ status: 'success', data: pedido });
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/pedidos/usuario/:usuarioId
 * Lista pedidos de un usuario (paginado)
 */
const listPedidosByUser = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await pedidoService.listPedidosByUser(usuarioId, { page, limit });
    return res.json({ status: 'success', ...result });
  } catch (error) {
    console.error('Error listando pedidos por usuario:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/pedidos/:id
 * Actualización parcial del pedido (por ejemplo notas, envio, etc.)
 */
const patchPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData._id) delete updateData._id;
    const updated = await pedidoService.updatePedido(id, updateData);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Pedido no encontrado o id inválido' });
    return res.json({ status: 'success', data: updated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error actualizando pedido:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/pedidos/:id/estado
 * Cambiar estado del pedido (pendiente, pagado, enviado, entregado, cancelado)
 */
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const updated = await pedidoService.updatePedidoEstado(id, estado);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Pedido no encontrado o id inválido' });
    return res.json({ status: 'success', data: updated });
  } catch (error) {
    console.error('Error actualizando estado del pedido:', error);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};

/**
 * DELETE /api/pedidos/:id
 */
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pedidoService.deletePedido(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Pedido no encontrado o id inválido' });
    return res.json({ status: 'success', message: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando pedido:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

module.exports = {
  createPedido,
  getPedido,
  listPedidosByUser,
  patchPedido,
  updateEstado,
  deletePedido,
};
