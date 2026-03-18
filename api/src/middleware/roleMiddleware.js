// src/middleware/roleMiddleware.js

/**
 * Middleware de control d'accés per rols (RBAC)
 * @param  {...string} roles - Llista de rols permesos (ej. 'admin', 'cliente')
 */
module.exports = (...roles) => {
  return (req, res, next) => {
    // Verifica si req.user existeix per l'authMiddleware previa
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado, usuario no identificado',
      });
    }

    // Verifica si el rol de l'usuari està a la llista de rols permesos
    // Nota: El model usa 'rol' (singular), comprovo amb req.user.rol
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        status: 'error',
        message: 'Accés prohibit: no tens els permisos necessaris',
      });
    }

    next();
  };
};
