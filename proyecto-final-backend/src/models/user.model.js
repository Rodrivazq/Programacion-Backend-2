import mongoose from "mongoose";

// Esquema de Usuario
// Define los campos principales y las restricciones asociadas.
const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Debe ser un email válido"],
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },

    rol: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.password; // No exponer el hash de contraseña
        return ret;
      },
    },
  }
);

// Índices para optimizar búsqueda por email y rol
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ rol: 1 });

// Virtual de conveniencia
userSchema.virtual("isAdmin").get(function () {
  return this.rol === "admin";
});

export default mongoose.model("User", userSchema);
