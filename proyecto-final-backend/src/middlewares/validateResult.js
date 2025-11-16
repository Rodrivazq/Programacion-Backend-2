import { validationResult } from "express-validator";

const validateResult = (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formatted = errors.array().map((err) => ({
        campo: err.param,
        mensaje: err.msg,
      }));

      return res.status(400).json({
        status: "error",
        message: "Errores de validación",
        errores: formatted,
      });
    }

    next();
  } catch (error) {
    console.error("Error en validateResult:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error al procesar validaciones",
    });
  }
};

export default validateResult;
