// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'cambio_en_produccion';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_cambio_en_produccion';
const ACCESS_TOKEN_EXPIRES = '15m';   // Access token: 15 minutos
const REFRESH_TOKEN_EXPIRES = '7d';   // Refresh token: 7 dies

/**
 * POST /api/auth/register
 * Flux:
 *   1. Rebre dades de l'usuari
 *   2. Verificar que l'email no existeix
 *   3. Hashejar la contrasenya (ho fa el pre-save del model)
 *   4. Guardar usuari a MongoDB
 */
const register = async (req, res) => {
  try {
    const { nombre, email, password, apellidos, teléfono, dirección } = req.body;

    // Validació bàsica
    if (!nombre || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre, email y password son obligatorios',
      });
    }

    // Verificar que l'email no existeix
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'El correo ya está registrado',
      });
    }

    // Crear usuari (el model hasheja la contrasenya automàticament al pre-save)
    const user = new Usuario({
      nombre,
      email,
      contraseña: password,
      apellidos,
      teléfono,
      dirección,
    });

    const savedUser = await user.save();

    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado correctamente',
      data: savedUser, // toJSON() del model ja elimina la contrasenya
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ status: 'error', message: messages.join('; ') });
    }
    console.error('Error en register:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/auth/login
 * Flux:
 *   1. Buscar usuari per email
 *   2. Comparar contrasenya amb bcrypt
 *   3. Generar access token (curt, 15min)
 *   4. Generar refresh token (llarg, 7d)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y password son obligatorios',
      });
    }

    // 1. Buscar usuari per email
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    // 2. Comparar contrasenya amb bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    // Payload comú
    const payload = {
      id: user._id.toString(),
      email: user.email,
      rol: user.rol,
    };

    // 3. Generar access token (curt)
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    // 4. Generar refresh token (llarg)
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });

    // ✅ GUARDAR REFRESH TOKEN A LA BASE DE DADES (sense disparar validacions)
    await Usuario.findByIdAndUpdate(user._id, { refreshToken });

    return res.json({
      status: 'success',
      message: 'Login correcto',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/auth/refresh
 * Flux:
 *   1. L'usuari envia el refresh token
 *   2. Es valida el refresh token
 *   3. Es genera un nou access token
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token es obligatorio',
      });
    }

    // Validar el refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token inválido o expirado',
      });
    }

    // ✅ VALIDAR QUE EL TOKEN EXISTEIXI A LA BASE DE DADES (Seguretat extra per logout)
    const user = await Usuario.findOne({ _id: decoded.id, refreshToken: refreshToken });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token no válido o sesión cerrada',
      });
    }

    // Generar un nou access token
    const payload = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
    };

    const newAccessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    return res.json({
      status: 'success',
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error('Error en refresh:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/auth/logout
 * Flux:
 *   1. Eliminar refresh token associat a l'usuari
 */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token es obligatorio para cerrar sesión',
      });
    }

    // Eliminar el refresh token de l'usuari
    await Usuario.findOneAndUpdate(
      { refreshToken: refreshToken },
      { $set: { refreshToken: null } }
    );

    return res.json({
      status: 'success',
      message: 'Sesión cerrada correctamente',
    });
  } catch (error) {
    console.error('Error en logout:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
