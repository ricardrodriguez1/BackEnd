// src/controllers/categoriaController.js
const categoriaService = require('../services/categoriaService');

/**
 * POST /api/categorias
 */
const createCategoria = async (req, res) => {
  try {
    const categoria = await categoriaService.createCategoria(req.body);
    return res.status(201).json({ status: 'success', data: categoria });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {}).join(', ');
      return res.status(400).json({
        status: 'error',
        message: `Registro duplicado: ${field} ya existe en la base de datos.`,
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error creando categoría:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/categorias
 */
const listCategorias = async (req, res) => {
  try {
    const result = await categoriaService.listCategorias(req.query);
    // result puede ser { data, total, page, pages } o simplemente array
    if (result && result.data) {
      return res.json({ status: 'success', ...result });
    }
    return res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error listando categorías:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/categorias/:id
 */
const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaService.getCategoriaById(id);
    if (!categoria) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    return res.json({ status: 'success', data: categoria });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/categorias/:id
 */
const patchCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await categoriaService.updateCategoria(id, updateData);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada o id inválido' });
    return res.json({ status: 'success', data: updated });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {}).join(', ');
      return res.status(400).json({
        status: 'error',
        message: `Registro duplicado: ${field} ya existe en la base de datos.`,
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error actualizando categoría:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * DELETE /api/categorias/:id
 */
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await categoriaService.deleteCategoria(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Categoría no encontrada o id inválido' });
    return res.json({ status: 'success', message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

module.exports = {
  createCategoria,
  listCategorias,
  getCategoria,
  patchCategoria,
  deleteCategoria,
};
