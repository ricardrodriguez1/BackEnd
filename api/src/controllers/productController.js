const productService = require('../services/productService');

/**
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({ status: 'success', data: product });
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
    console.error('Error creando producto:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/products
 */
const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = {};
    if (req.query.categoria) filter.categoria = req.query.categoria;
    const result = await productService.listProducts({ page, limit, filter });
    return res.json({ status: 'success', ...result });
  } catch (error) {
    console.error('Error listando productos:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/products/:id
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    return res.json({ status: 'success', data: product });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/products/:id
 * Actualització parcial: només els camps enviats són modificats.
 */
const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Evitar actualitzar _id per error
    if (updateData._id) delete updateData._id;

    const updated = await productService.updateProduct(id, updateData);

    if (!updated) {
      // si id no és vàlid o no existeix
      return res.status(404).json({ status: 'error', message: 'Producte no trobat o id invàlid' });
    }

    return res.json({ status: 'success', data: updated });
  } catch (error) {
    // Duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {}).join(', ');
      return res.status(400).json({
        status: 'error',
        message: `Registro duplicado: ${field} ya existe en la base de datos.`,
      });
    }
    // Validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error actualizando producto:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat o id invàlid' });
    }
    return res.json({ status: 'success', message: 'Producte eliminat correctament' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  patchProduct,
  deleteProduct
};
