// src/scripts/seed.js
// Ejecutar con: node src/scripts/seed.js
require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('../models/product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://ricard:root@127.0.0.1:27027/ecommerce?authSource=admin';

// Imagen placeholder (Resident Evil 4)
const RE4_IMG = 'https://upload.wikimedia.org/wikipedia/en/d/df/Resident_Evil_4_remake_cover_art.jpg';

const productos = [
    // === VIDEOCONSOLAS ===
    { nombre: 'PlayStation 5', precio: 549.99, stock: 15, categoria: 'videoconsolas', descripcion: 'La consola next-gen de Sony amb SSD ultrarrápida i DualSense.', imagen_url: RE4_IMG },
    { nombre: 'PlayStation 5 Digital', precio: 449.99, stock: 20, categoria: 'videoconsolas', descripcion: 'Versió digital sense lector de discs.', imagen_url: RE4_IMG },
    { nombre: 'Xbox Series X', precio: 499.99, stock: 12, categoria: 'videoconsolas', descripcion: 'La consola més potent de Microsoft amb 12 teraflops.', imagen_url: RE4_IMG },
    { nombre: 'Xbox Series S', precio: 299.99, stock: 25, categoria: 'videoconsolas', descripcion: 'Consola compacta i assequible de nova generació.', imagen_url: RE4_IMG },
    { nombre: 'Nintendo Switch OLED', precio: 349.99, stock: 18, categoria: 'videoconsolas', descripcion: 'Versió millorada amb pantalla OLED de 7 polzades.', imagen_url: RE4_IMG },
    { nombre: 'Nintendo Switch Lite', precio: 199.99, stock: 30, categoria: 'videoconsolas', descripcion: 'Versió portàtil exclusiva, lleugera i compacta.', imagen_url: RE4_IMG },
    { nombre: 'Steam Deck 512GB', precio: 679.99, stock: 8, categoria: 'videoconsolas', descripcion: 'El PC gaming portàtil de Valve amb SteamOS.', imagen_url: RE4_IMG },
    { nombre: 'PlayStation 2 (Retro)', precio: 89.99, stock: 5, categoria: 'videoconsolas', descripcion: 'La llegendària PS2 restaurada. Perfecta per col·leccionistes.', imagen_url: RE4_IMG },

    // === VIDEOJUEGOS ===
    { nombre: 'Resident Evil 4 Remake', precio: 69.99, stock: 50, categoria: 'videojuegos', descripcion: 'El clàssic de terror reimaginat per a la nova generació.', imagen_url: RE4_IMG },
    { nombre: 'The Legend of Zelda: TOTK', precio: 69.99, stock: 40, categoria: 'videojuegos', descripcion: 'Explora Hyrule en aquesta èpica aventura de Nintendo.', imagen_url: RE4_IMG },
    { nombre: 'God of War Ragnarök', precio: 59.99, stock: 35, categoria: 'videojuegos', descripcion: "Continua l'aventura de Kratos i Atreus.", imagen_url: RE4_IMG },
    { nombre: 'Elden Ring', precio: 54.99, stock: 45, categoria: 'videojuegos', descripcion: 'El món obert de FromSoftware i George R.R. Martin.', imagen_url: RE4_IMG },
    { nombre: 'Hogwarts Legacy', precio: 64.99, stock: 30, categoria: 'videojuegos', descripcion: "Viu la teva pròpia aventura a l'univers de Harry Potter.", imagen_url: RE4_IMG },
    { nombre: 'Spider-Man 2', precio: 69.99, stock: 25, categoria: 'videojuegos', descripcion: 'Peter i Miles junts en la millor aventura de Spider-Man.', imagen_url: RE4_IMG },
    { nombre: 'Final Fantasy XVI', precio: 69.99, stock: 20, categoria: 'videojuegos', descripcion: "L'última entrega de la saga RPG més icònica.", imagen_url: RE4_IMG },
    { nombre: "Baldur's Gate 3", precio: 59.99, stock: 28, categoria: 'videojuegos', descripcion: "El millor RPG de l'any amb 100+ hores de contingut.", imagen_url: RE4_IMG },

    // === FIGURAS ===
    { nombre: 'Gogeta SSJ Blue (Banpresto)', precio: 89.99, stock: 10, categoria: 'figuras', descripcion: 'Figura de 25cm de Gogeta en estat SSJ Blue.', imagen_url: RE4_IMG },
    { nombre: 'Goku Ultra Instinct', precio: 79.99, stock: 12, categoria: 'figuras', descripcion: 'Figura premium de Goku en Migatte no Gokui.', imagen_url: RE4_IMG },
    { nombre: 'Vegeta SSBE', precio: 74.99, stock: 14, categoria: 'figuras', descripcion: 'Vegeta en Super Saiyan Blue Evolved.', imagen_url: RE4_IMG },
    { nombre: 'Naruto Sage Mode', precio: 69.99, stock: 16, categoria: 'figuras', descripcion: 'Naruto en mode Sennin amb efectes de chakra.', imagen_url: RE4_IMG },
    { nombre: 'Luffy Gear 5', precio: 99.99, stock: 8, categoria: 'figuras', descripcion: 'Figura exclusiva de Luffy Nika amb efectes especials.', imagen_url: RE4_IMG },
    { nombre: 'Tanjiro Kamado', precio: 59.99, stock: 20, categoria: 'figuras', descripcion: 'Figura de Demon Slayer amb espasa nichirin.', imagen_url: RE4_IMG },
    { nombre: 'Eren Jaeger (Titan)', precio: 129.99, stock: 6, categoria: 'figuras', descripcion: "Figura grande del Titan d'Atac de 40cm.", imagen_url: RE4_IMG },
    { nombre: 'Saitama (One Punch Man)', precio: 54.99, stock: 18, categoria: 'figuras', descripcion: 'El heroi més fort amb pose còmica.', imagen_url: RE4_IMG },

    // === COMPONENTES PC ===
    { nombre: 'NVIDIA RTX 4070 Super', precio: 649.99, stock: 10, categoria: 'componentes', descripcion: "Targeta gràfica d'última generació amb DLSS 3.", imagen_url: RE4_IMG },
    { nombre: 'NVIDIA RTX 4080 Super', precio: 999.99, stock: 5, categoria: 'componentes', descripcion: 'Potència extrema per a 4K gaming.', imagen_url: RE4_IMG },
    { nombre: 'AMD RX 7800 XT', precio: 549.99, stock: 12, categoria: 'componentes', descripcion: 'Excel·lent rendiment-preu per a 1440p.', imagen_url: RE4_IMG },
    { nombre: 'Intel Core i7-14700K', precio: 449.99, stock: 15, categoria: 'componentes', descripcion: 'Processador de 20 nuclis per a gaming i creació.', imagen_url: RE4_IMG },
    { nombre: 'AMD Ryzen 7 7800X3D', precio: 399.99, stock: 18, categoria: 'componentes', descripcion: 'El millor processador per a gaming amb 3D V-Cache.', imagen_url: RE4_IMG },
    { nombre: 'Corsair Vengeance 32GB DDR5', precio: 159.99, stock: 25, categoria: 'componentes', descripcion: 'Memòria RAM DDR5-6000 amb RGB.', imagen_url: RE4_IMG },
    { nombre: 'Samsung 990 Pro 2TB', precio: 189.99, stock: 20, categoria: 'componentes', descripcion: 'SSD NVMe Gen4 amb 7450MB/s de lectura.', imagen_url: RE4_IMG },
    { nombre: 'Logitech G Pro X Superlight', precio: 149.99, stock: 22, categoria: 'componentes', descripcion: 'Ratolí wireless per a esports de 63g.', imagen_url: RE4_IMG },
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connectat a MongoDB');

        // Eliminar productos existentes
        await Product.deleteMany({});
        console.log('🗑️  Productes anteriors eliminats');

        // Insertar nuevos productos
        const inserted = await Product.insertMany(productos);
        console.log(`✅ ${inserted.length} productes insertats correctament!`);

        // Resumen por categoría
        const categorias = {};
        inserted.forEach(p => {
            categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
        });
        console.log('📊 Resum per categoria:');
        Object.entries(categorias).forEach(([cat, count]) => {
            console.log(`   - ${cat}: ${count} productes`);
        });

        await mongoose.disconnect();
        console.log('👋 Desconnectat de MongoDB');
    } catch (err) {
        console.error('❌ Error en el seed:', err.message);
        process.exit(1);
    }
}

seed();
