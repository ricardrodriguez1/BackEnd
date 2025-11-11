// src/services/pedidoService.js
const Pedido = require('../models/Pedido');
const mongoose = require('mongoose');

/**
 * Crear pedido
 */
const createPedido = async (data) => {
  const pedido = new Pedido(data);
  return await pedido.save();
};

/**
 * Obtener pedido por ID
 */
const getPedidoById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Pedido.findById(id)
    .populate('usuario', 'nombre apellidos email')
    .populate('lineas.producto', 'nombre precio')
    .lean();
};

/**
 * Listar pedidos de un usuario
 */
const listPedidosByUser = async (usuarioId, { page = 1, limit = 20 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
    return { data: [], total: 0, page, pages: 0 };
  }
  const skip = (page - 1) * limit;
  const filter = { usuario: usuarioId };
  const docs = await Pedido.find(filter).sort({ fecha: -1 }).skip(skip).limit(limit).lean();
  const total = await Pedido.countDocuments(filter);
  return { data: docs, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Actualizar un pedido parcialmente
 */
const updatePedido = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Pedido.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Actualizar solo el estado del pedido
 */
const updatePedidoEstado = async (id, estado) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const allowed = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
  if (!allowed.includes(estado)) throw new Error('Estado no válido');
  return await Pedido.findByIdAndUpdate(id, { estado }, { new: true });
};

/**
 * Eliminar un pedido
 */
const deletePedido = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Pedido.findByIdAndDelete(id);
};

module.exports = {
  createPedido,
  getPedidoById,
  listPedidosByUser,
  updatePedido,
  updatePedidoEstado,
  deletePedido,
};
