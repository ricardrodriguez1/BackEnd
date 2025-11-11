// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,   // pon true si quieres validar
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  imagen_url: {
    type: String,
  },
  categoria: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Exporta con la misma capitalización que usarás en refs/populates
module.exports = mongoose.model('Product', productSchema);
