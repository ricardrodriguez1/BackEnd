// src/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Crear categoría
router.post('/', categoriaController.createCategoria);

// Listar todas las categorías
router.get('/', categoriaController.listCategorias);

// Obtener una categoría por ID
router.get('/:id', categoriaController.getCategoria);

// Actualizar parcialmente una categoría
router.patch('/:id', categoriaController.patchCategoria);

// Eliminar una categoría
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
