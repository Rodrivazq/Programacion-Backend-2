import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // Usuario dueño del carrito (uno por usuario)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Productos dentro del carrito
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "La cantidad mínima es 1"],
          default: 1,
        },
      },
    ],
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

// Evita agregar productos duplicados en el mismo carrito
cartSchema.pre("save", function (next) {
  if (!this.products || this.products.length <= 1) return next();

  const ids = this.products.map((p) => p.product.toString());
  const duplicated = ids.some((id, idx) => ids.indexOf(id) !== idx);

  if (duplicated) {
    return next(new Error("No pueden agregarse productos duplicados al carrito."));
  }

  next();
});

// Calcula el total (requiere populate previo)
cartSchema.methods.calculateTotal = function () {
  if (!this.populated("products.product")) {
    throw new Error("Los productos deben estar poblados para calcular el total.");
  }

  return this.products.reduce((sum, p) => {
    const price = Number(p.product?.price) || 0;
    return sum + price * p.quantity;
  }, 0);
};

// Vacía el carrito luego de la compra
cartSchema.methods.clear = async function () {
  this.products = [];
  await this.save();
};

export default mongoose.model("Cart", cartSchema);
