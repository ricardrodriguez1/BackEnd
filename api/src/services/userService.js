// src/services/userService.js
const Usuario = require('../models/user');
const mongoose = require('mongoose');

/**
 * Crear usuario
 */
const createUser = async (data) => {
  const user = new Usuario(data);
  return await user.save();
};

/**
 * Listar usuarios
 */
const listUsers = async () => {
  return await Usuario.find().select('-contraseña').lean(); // No devolvemos la contraseña
};

/**
 * Obtener usuario por ID
 */
const getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Usuario.findById(id).select('-contraseña').lean();
};

/**
 * Actualizar usuario parcialmente
 */
const updateUser = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  // Nunca permitir actualizar el campo contraseña por error
  if (data.contraseña) delete data.contraseña;
  return await Usuario.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select('-contraseña');
};

/**
 * Eliminar usuario
 */
const deleteUser = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Usuario.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
