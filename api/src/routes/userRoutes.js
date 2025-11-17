// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// =========================
//   AUTH - RUTAS ACTUALES
// =========================
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// =========================
//   NUEVA RUTA SEGÚN LA IMAGEN
// =========================
router.post('/hogin', userController.loginUser); // ✅ NUEVA RUTA

// =========================
//   CRUD USUARIOS
// =========================
router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.patchUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;