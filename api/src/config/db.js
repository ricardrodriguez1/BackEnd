// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27027/ecommerce';
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connectat correctament a:', MONGO_URI);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

