const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas de productos
router.post('/', productController.createProduct);       // Crear producto
router.get('/', productController.listProducts);         // Listar productos
router.get('/:id', productController.getProduct);        // Obtener producto por ID
router.patch('/:id', productController.patchProduct);    // Actualizar parcialmente
router.delete('/:id', productController.deleteProduct);  // Eliminar producto

module.exports = router;
