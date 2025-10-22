const Product = require('../models/Product');
const mongoose = require('mongoose');

const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

const listProducts = async ({ page = 1, limit = 20, filter = {} } = {}) => {
  const skip = (page - 1) * limit;
  const docs = await Product.find(filter).skip(skip).limit(limit).lean();
  const total = await Product.countDocuments(filter);
  return {
    data: docs,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const getProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findById(id).lean();
};

/**
 * updateData = object amb els camps a actualitzar (partial)
 * Retorna el document actualitzat (no lean) per si volem manipulacions post-update.
 */
const updateProduct = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  // { new: true } retorna el document actualitzat
  // runValidators: true garanteix que les validacions del schema s'apliquin
  const updated = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updated;
};

const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
