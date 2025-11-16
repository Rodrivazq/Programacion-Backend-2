import mongoose from "mongoose";

// Subesquema para los ítems del ticket (snapshot del producto en el momento de la compra)
const itemSchema = new mongoose.Schema(
  {
    // Referencia al producto original
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Título del producto en el momento de la compra
    title: { type: String, required: true, trim: true },

    // Precio unitario en el momento de la compra
    price: { type: Number, required: true, min: 0 },

    // Cantidad comprada
    quantity: { type: Number, required: true, min: 1 },

    // Subtotal = price * quantity
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// Esquema principal de Ticket
const ticketSchema = new mongoose.Schema(
  {
    // Código único del ticket
    code: { type: String, required: true, unique: true, index: true },

    // Usuario que realizó la compra
    purchaser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Lista de ítems comprados
    items: { type: [itemSchema], default: [] },

    // Monto total de la compra
    amount: { type: Number, required: true, min: 0 },

    // Fecha/hora explícita de compra
    purchasedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

// Recalcula el total si no coincide con la suma de subtotales
ticketSchema.pre("validate", function (next) {
  if (Array.isArray(this.items) && this.items.length > 0) {
    const sum = this.items.reduce((acc, i) => acc + Number(i.subtotal || 0), 0);
    if (!this.amount || sum !== this.amount) {
      this.amount = sum;
    }
  }
  next();
});

// Índice compuesto útil para búsquedas por comprador y código
ticketSchema.index({ purchaser: 1, code: 1 });

export default mongoose.model("Ticket", ticketSchema);
