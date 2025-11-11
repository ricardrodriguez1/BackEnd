// src/controllers/userController.js
const userService = require('../services/userService');
const bcrypt = require('bcryptjs'); // si quieres encriptar contraseñas aquí (opcional)

/**
 * POST /api/users  (registro)
 */
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    // Si quieres, puedes encriptar la contraseña aquí antes de pasar al service:
    if (userData.contraseña) {
      const salt = await bcrypt.genSalt(10);
      userData.contraseña = await bcrypt.hash(userData.contraseña, salt);
    }
    const user = await userService.createUser(userData);
    return res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ status: 'error', message: 'Email ya registrado' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error registrando usuario:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/users
 */
const listUsers = async (req, res) => {
  try {
    const result = await userService.listUsers(req.query);
    if (result && result.data) return res.json({ status: 'success', ...result });
    return res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/users/:id
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    // No devolver contraseña
    if (user.contraseña) user.contraseña = undefined;
    return res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/users/:id
 */
const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData._id) delete updateData._id;
    // Si actualizan contraseña, encriptarla
    if (updateData.contraseña) {
      const salt = await bcrypt.genSalt(10);
      updateData.contraseña = await bcrypt.hash(updateData.contraseña, salt);
    }
    const updated = await userService.updateUser(id, updateData);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado o id inválido' });
    if (updated.contraseña) updated.contraseña = undefined;
    return res.json({ status: 'success', data: updated });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ status: 'error', message: 'Email ya registrado' });
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error actualizando usuario:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado o id inválido' });
    return res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

module.exports = {
  registerUser,
  listUsers,
  getUser,
  patchUser,
  deleteUser,
};
