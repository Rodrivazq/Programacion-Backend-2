import { check, validationResult } from "express-validator";

/**
 * Validadores de autenticación.
 *
 * Middlewares para validar datos de registro y login
 * usando express-validator. Si hay errores, responden con 400.
 */

// Validación para registro de usuario
export const validateRegister = [
  check("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido"),

  check("email")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  check("password")
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
export const validateLogin = [
  check("email")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  check("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),

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
