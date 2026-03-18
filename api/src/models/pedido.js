// src/models/Pedido.js
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Subdocumento: línea del pedido
const lineaSchema = new Schema(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false, // ✅ Ahora es opcional - permite crear pedidos sin ObjectId de producto
    },
    nombre_producto: {
      type: String,
      required: [true, 'Se requiere nombre del producto en la línea'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
    },
    precio_unitario: {
      type: Number,
      required: [true, 'El precio unitario es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    subtotal: {
      type: Number,
      min: [0, 'Subtotal inválido'],
    },
  },
  { _id: true }
);

// Subdocumento: pago / factura
const pagoSchema = new Schema(
  {
    metodo: { type: String, enum: ['tarjeta', 'paypal', 'transferencia', 'otros'], default: 'tarjeta' },
    fecha_pago: { type: Date },
    importe: { type: Number, min: 0 },
    referencia: { type: String }, // id transacción / referencia
  },
  { _id: false }
);

// Subdocumento: envío
const envioSchema = new Schema(
  {
    direccion_envio: { type: String, required: false },
    empresa_transport: { type: String },
    codigo_seguimiento: { type: String },
    estado_envio: { type: String, enum: ['pendiente', 'en_transito', 'entregado', 'devuelto'], default: 'pendiente' },
    fecha_envio: { type: Date },
    fecha_entrega: { type: Date },
  },
  { _id: false }
);

const pedidoSchema = new Schema(
  {
    // ✅ Usuario ahora es opcional y flexible (puede ser String o ObjectId)
    usuario: {
      type: Schema.Types.Mixed,  // Acepta tanto ObjectId como String
      required: false,
    },
    // ✅ Campos de envío que el frontend envía
    direccion: {
      type: String,
      required: false,
    },
    ciudad: {
      type: String,
      required: false,
    },
    codigo_postal: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: false,
    },
    metodo_pago: {
      type: String,
      enum: ['tarjeta', 'paypal', 'transferencia', 'contrareembolso', 'otros'],
      default: 'tarjeta',
    },
    fecha: {
      type: Date,
      default: Date.now,
      index: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
      default: 'pendiente',
    },
    productos: {
      type: [lineaSchema],
      validate: [
        {
          validator: function (v) {
            return Array.isArray(v) && v.length > 0;
          },
          message: 'El pedido debe contener al menos una línea de pedido',
        },
      ],
    },
    total: {
      type: Number,
      min: [0, 'Total inválido'],
      default: 0,
    },
    pago: {
      type: pagoSchema,
      default: null,
    },
    envio: {
      type: envioSchema,
      default: null,
    },
    notas: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices útiles
pedidoSchema.index({ usuario: 1, fecha: -1 });

// Calcular subtotal de cada línea y total del pedido antes de validar/guardar
pedidoSchema.pre('validate', function (next) {
  try {
    if (this.productos && Array.isArray(this.productos)) {
      let computedTotal = 0;
      this.productos = this.productos.map((ln) => {
        // asegurar tipos
        const cantidad = Number(ln.cantidad || 0);
        const precio = Number(ln.precio_unitario || 0);
        const subtotal = Number((cantidad * precio).toFixed(2));
        computedTotal += subtotal;
        // mantener nombre_producto si no se pasa (intenta mantener consistencia)
        return {
          ...ln.toObject ? ln.toObject() : ln,
          cantidad,
          precio_unitario: precio,
          subtotal,
        };
      });
      this.total = Number(computedTotal.toFixed(2));
    } else {
      this.total = 0;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Método de instancia para marcar como pagado (ejemplo)
 */
pedidoSchema.methods.marcarComoPagado = function ({ metodo, referencia, fecha = new Date(), importe }) {
  this.pago = {
    metodo: metodo || 'tarjeta',
    fecha_pago: fecha,
    importe: importe != null ? importe : this.total,
    referencia,
  };
  this.estado = 'pagado';
  return this.save();
};

module.exports = mongoose.model('Pedido', pedidoSchema);
