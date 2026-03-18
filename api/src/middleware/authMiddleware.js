// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'cambio_en_produccion';

const authMiddleware = (req, res, next) => {
  // 1. Obtenir token del header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acceso denegado, token no proporcionado',
    });
  }

  try {
    // 2. Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Adjuntar dades de l'usuari a req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
    });
  }
};

module.exports = authMiddleware;
