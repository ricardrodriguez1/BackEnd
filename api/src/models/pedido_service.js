// src/services/pedidoService.js
const Pedido = require('../models/pedido');
const mongoose = require('mongoose');

/**
 * Crear pedido (espera objeto con: usuario, lineas: [{ producto, nombre_producto, cantidad, precio_unitario }], opcional pago/envio)
 */
const createPedido = async (pedidoData) => {
  const pedido = new Pedido(pedidoData);
  return await pedido.save();
};

const getPedidoById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  // popular usuario y las lineas.producto si quieres
  return await Pedido.findById(id)
    .populate('usuario', 'nombre apellidos email')
    .populate('lineas.producto', 'nombre precio') // solo si Product model existe y tiene campos
    .lean();
};

const listPedidosByUser = async (usuarioId, { page = 1, limit = 20 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(usuarioId)) return { data: [], total: 0, page, pages: 0 };
  const skip = (page - 1) * limit;
  const filter = { usuario: usuarioId };
  const docs = await Pedido.find(filter).sort({ fecha: -1 }).skip(skip).limit(limit).lean();
  const total = await Pedido.countDocuments(filter);
  return { data: docs, total, page, pages: Math.ceil(total / limit) };
};

const updatePedidoEstado = async (id, nuevoEstado) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const allowed = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
  if (!allowed.includes(nuevoEstado)) throw new Error('Estado no válido');
  return await Pedido.findByIdAndUpdate(id, { estado: nuevoEstado }, { new: true });
};

const deletePedido = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Pedido.findByIdAndDelete(id);
};

module.exports = {
  createPedido,
  getPedidoById,
  listPedidosByUser,
  updatePedidoEstado,
  deletePedido,
};
