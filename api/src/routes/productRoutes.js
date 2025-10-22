const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.patch('/:id', productController.patchProduct); // actualització parcial
router.delete('/:id', productController.deleteProduct);

module.exports = router;
