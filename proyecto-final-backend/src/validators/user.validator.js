import { body, validationResult } from "express-validator";

// Validación para registro
export const registerValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .isEmail()
    .withMessage("El email debe ser válido"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = errors.array().map((err) => ({
        campo: err.param,
        mensaje: err.msg,
      }));
      return res.status(400).json({
        status: "error",
        errors: formatted,
      });
    }
    next();
  },
];

// Validación para login
export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("El email debe ser válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = errors.array().map((err) => ({
        campo: err.param,
        mensaje: err.msg,
      }));
      return res.status(400).json({
        status: "error",
        errors: formatted,
      });
    }
    next();
  },
];
