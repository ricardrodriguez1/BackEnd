// src/index.js
// ⚠️ IMPORTANTE: dotenv debe cargarse PRIMERO, antes de cualquier otra cosa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors()); // ✅ IMPRESCINDIBLE para que el frontend pueda conectar
app.use(express.json());

// Conexión a base de datos
connectDB();

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));       // ✅ Auth (register, login, refresh, logout)
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/usuarios', require('./routes/userRoutes')); // Alias
app.use('/api/usuari', require('./routes/userRoutes'));  // Alias
app.use('/api/pedidos', require('./routes/pedidoRoutes'));

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`👉 Rutas disponibles:`);
    console.log(`   - POST /api/users/register`);
    console.log(`   - POST /api/users/login`);
    console.log(`   - POST /api/pedidos`);
    console.log(`   - GET  /api/health`);
});