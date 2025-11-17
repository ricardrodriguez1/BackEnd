// src/services/userService.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Usuario = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'cambio_en_produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Crear usuario
 */
const createUser = async (data) => {
  try {
    const user = new Usuario(data);
    const saved = await user.save();
    return saved;
  } catch (error) {
    throw error;
  }
};

/**
 * Login: verifica credenciales y genera token
 * ✅ AHORA USA "password" EN LUGAR DE "contraseña"
 */
const loginUser = async (email, password) => {
  const user = await Usuario.findOne({ email });
  if (!user) return null;

  // ✅ Comparar con la contraseña del usuario (que en el modelo se llama "contraseña")
  const ok = await user.comparePassword(password);
  if (!ok) return null;

  const payload = { 
    id: user._id.toString(), 
    email: user.email, 
    rol: user.rol 
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  });

  return { user, token };
};

/**
 * Listar usuarios (sin contraseña)
 */
const listUsers = async () => {
  return await Usuario.find().select('-contraseña').lean();
};

/**
 * Obtener usuario por ID (sin contraseña)
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

  if (data.contraseña) {
    const user = await Usuario.findById(id);
    if (!user) return null;
    
    Object.keys(data).forEach((k) => {
      user[k] = data[k];
    });
    const saved = await user.save();
    return saved;
  }

  const updated = await Usuario.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select('-contraseña');

  return updated;
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
  loginUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};