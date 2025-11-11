// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registrar nuevo usuario
router.post('/', userController.registerUser);

// Listar usuarios (solo si se permite)
router.get('/', userController.listUsers);

// Obtener usuario por ID
router.get('/:id', userController.getUser);

// Actualizar parcialmente usuario
router.patch('/:id', userController.patchUser);

// Eliminar usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;
