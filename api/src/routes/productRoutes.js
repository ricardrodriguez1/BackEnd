const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nou producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - stock
 *               - categoria
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Samarreta blava"
 *               descripcion:
 *                 type: string
 *                 example: "Samarreta de cotó 100%"
 *               precio:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               imagen_url:
 *                 type: string
 *                 example: "https://example.com/img.jpg"
 *               categoria:
 *                 type: string
 *                 example: "Roba"
 *     responses:
 *       201:
 *         description: Producte creat correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dades invàlides
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Llistar tots els productes
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Llista de productes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.listProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtenir un producte per ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producte
 *     responses:
 *       200:
 *         description: Producte trobat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producte no trobat
 */
router.get('/:id', productController.getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Actualitzar parcialment un producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producte
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: number
 *               imagen_url:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producte actualitzat
 *       404:
 *         description: Producte no trobat
 */
router.patch('/:id', productController.patchProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producte
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producte
 *     responses:
 *       200:
 *         description: Producte eliminat correctament
 *       404:
 *         description: Producte no trobat
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
