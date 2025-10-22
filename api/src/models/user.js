import mongoose from "mongoose";

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

//  Índice para búsquedas por email
usuarioSchema.index({ email: 1 });

//  Ejemplo de validación custom
usuarioSchema.path("email").validate(async function (value) {
  const count = await mongoose.models.Usuario.countDocuments({ email: value });
  return !count;
}, "El correo ya está registrado");

export default model("Usuario", usuarioSchema);
