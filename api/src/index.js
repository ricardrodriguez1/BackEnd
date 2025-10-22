require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes'); // <- importem les rutes

const app = express();
app.use(express.json());

// connectar a la BD
connectDB();

// ruta principal
app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

// muntar rutes de productes sota el prefix /api/products
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor escoltant al port ${PORT}`)
);
