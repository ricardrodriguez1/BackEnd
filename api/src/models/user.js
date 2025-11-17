// src/models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede superar los 50 caracteres"],
    },
    apellidos: {
      type: String,
      required: [true, "Los apellidos son obligatorios"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "El formato del correo no es válido",
      ],
    },
    contraseña: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    teléfono: {
      type: String,
      match: [/^\d{9}$/, "El teléfono debe tener 9 dígitos"],
    },
    rol: {
      type: String,
      enum: ["cliente", "administrador"],
      default: "cliente",
    },
    dirección: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para búsquedas por email
usuarioSchema.index({ email: 1 });

// Validación custom para que no repita email
usuarioSchema.path("email").validate(async function (value) {
  const count = await mongoose.models.Usuario.countDocuments({ email: value });
  return !count;
}, "El correo ya está registrado");

// Hash de la contraseña antes de guardar (solo si se ha modificado)
usuarioSchema.pre('save', async function (next) {
  try {
    // si no cambia la contraseña, seguir
    if (!this.isModified('contraseña')) return next();

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Método de instancia para comparar contraseñas en el login
usuarioSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.contraseña);
};

// Evitar devolver la contraseña en las respuestas JSON
usuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.contraseña;
  return obj;
};

// ✅ CORREGIR EXPORTACIÓN - Usar module.exports
module.exports = model('Usuario', usuarioSchema);