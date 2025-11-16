import { validationResult } from "express-validator";

// Middleware para manejar errores de validación generados por express-validator.
// Si encuentra errores, devuelve un 400 con un formato simple y claro.
// Si no hay errores, continúa con la cadena de middlewares.
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      campo: err.param,
      mensaje: err.msg,
    }));

    return res.status(400).json({
      status: "error",
      message: "Errores de validación",
      errors: formatted,
    });
  }

  next();
};
