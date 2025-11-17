// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());

// Conexión a base de datos
connectDB();

// Rutas
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/usuari', require('./routes/userRoutes')); // ✅ NUEVA RUTA BASE

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));