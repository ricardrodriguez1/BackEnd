// src/services/categoriaService.js
const Categoria = require('../models/categoria');
const mongoose = require('mongoose');

/**
 * Crear una categoría nueva
 */
const createCategoria = async (data) => {
  const categoria = new Categoria(data);
  return await categoria.save();
};

/**
 * Listar todas las categorías
 */
const listCategorias = async () => {
  return await Categoria.find().lean();
};

/**
 * Obtener una categoría por ID
 */
const getCategoriaById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Categoria.findById(id).lean();
};

/**
 * Actualizar una categoría (parcial)
 */
const updateCategoria = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Categoria.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Eliminar una categoría
 */
const deleteCategoria = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Categoria.findByIdAndDelete(id);
};

module.exports = {
  createCategoria,
  listCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
};
