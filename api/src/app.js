const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Rutas principales
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch((err) => console.error('🔴 Error al conectar con MongoDB:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));

module.exports = app;
