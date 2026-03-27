// src/routes/categoriaRoutes.js
const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nova categoria
 *     tags: [Categorias]
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Electrònica"
 *               descripcion:
 *                 type: string
 *                 example: "Productes electrònics"
 *               parent:
 *                 type: string
 *                 description: ID de la categoria pare (opcional)
 *     responses:
 *       201:
 *         description: Categoria creada correctament
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Dades invàlides
 */
router.post('/', categoriaController.createCategoria);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Llistar totes les categories
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Llista de categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get('/', categoriaController.listCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtenir una categoria per ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoria
 *     responses:
 *       200:
 *         description: Categoria trobada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria no trobada
 */
router.get('/:id', categoriaController.getCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   patch:
 *     summary: Actualitzar parcialment una categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria actualitzada
 *       404:
 *         description: Categoria no trobada
 */
router.patch('/:id', categoriaController.patchCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar una categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria eliminada
 *       404:
 *         description: Categoria no trobada
 */
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
