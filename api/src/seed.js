// backend/api/src/seed.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Definir el esquema mínimo para insertar productos
const productSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    imagen: String,
    categoria: String
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
    {
        nombre: "Boss Fight Sword",
        descripcion: "Una espada legendaria para derrotar a cualquier jefe final.",
        precio: 250.00,
        stock: 10,
        imagen: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500",
        categoria: "Armas"
    },
    {
        nombre: "Escudo del Titán",
        descripcion: "Protección máxima contra ataques mágicos y físicos.",
        precio: 180.50,
        stock: 5,
        imagen: "https://images.unsplash.com/photo-1590053132232-f3021728c891?w=500",
        categoria: "Armaduras"
    },
    {
        nombre: "Poción de Vida XL",
        descripcion: "Recupera todos tus puntos de vida instantáneamente.",
        precio: 15.00,
        stock: 100,
        imagen: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500",
        categoria: "Consumibles"
    }
];

async function seed() {
    try {
        console.log('Intentando conectar a:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado para cargar semillas...');

        // Limpiar productos antiguos
        await Product.deleteMany({});
        console.log('🗑️ Productos antiguos eliminados.');

        // Insertar nuevos
        await Product.insertMany(sampleProducts);
        console.log('✨ ¡Productos de prueba insertados con éxito!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error cargando semillas:', err);
        process.exit(1);
    }
}

seed();
