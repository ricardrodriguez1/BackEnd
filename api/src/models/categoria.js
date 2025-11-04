// src/models/Categoria.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Helper simple para crear slug (sin dependencia externa)
const makeSlug = (text) =>
  String(text || '')
    .normalize('NFKD')                  // normaliza acentos
    .replace(/[\u0300-\u036F]/g, '')   // elimina diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')       // reemplaza no-alphanum por guiones
    .replace(/^-+|-+$/g, '');          // quita guiones al principio/final

const categoriaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
      minlength: [1, 'Nombre demasiado corto'],
      maxlength: [100, 'Nombre demasiado largo'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, 'Descripción demasiado larga'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      default: null, // permite jerarquía opcional
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice único por nombre (normalizado) para evitar nombres duplicados
categoriaSchema.index({ nombre: 1 }, { unique: true });

// Antes de guardar, generar slug si no existe o si cambia el nombre
categoriaSchema.pre('validate', async function (next) {
  try {
    if (!this.isModified('nombre') && this.slug) return next();

    let baseSlug = makeSlug(this.nombre);
    if (!baseSlug) baseSlug = String(Date.now());

    // Asegurar unicidad del slug añadiendo sufijo incremental si hace falta
    let slugCandidate = baseSlug;
    let counter = 0;
    const Categoria = mongoose.models.Categoria;

    while (true) {
      const existing = await Categoria.findOne({ slug: slugCandidate, _id: { $ne: this._id } }).lean();
      if (!existing) break;
      counter += 1;
      slugCandidate = `${baseSlug}-${counter}`;
    }

    this.slug = slugCandidate;
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Método estático opcional: obtener árbol simple de categorías
 * (ejemplo de utilidad, no obligatorio).
 */
categoriaSchema.statics.getTreeSimple = async function () {
  const categorias = await this.find({ activo: true }).lean();
  // construir mapa por id
  const map = {};
  categorias.forEach((c) => (map[c._id.toString()] = { ...c, children: [] }));
  const roots = [];
  categorias.forEach((c) => {
    if (c.parent) {
      const parent = map[c.parent.toString()];
      if (parent) parent.children.push(map[c._id.toString()]);
      else roots.push(map[c._id.toString()]);
    } else {
      roots.push(map[c._id.toString()]);
    }
  });
  return roots;
};

module.exports = mongoose.model('Categoria', categoriaSchema);
