import { check, validationResult } from "express-validator";

/**
 * Validadores para creación y actualización de productos.
 * Se utilizan en:
 *   - POST /api/productos
 *   - PUT  /api/productos/:id
 */

// Validación para creación
export const validateCreateProduct = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("El título del producto es requerido"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es requerida"),

  check("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isNumeric()
    .withMessage("El precio debe ser un número válido"),

  check("stock")
    .optional()
    .isNumeric()
    .withMessage("El stock debe ser un número válido"),

  check("category")
    .trim()
    .notEmpty()
    .withMessage("La categoría es requerida"),

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

// Validación para actualización
export const validateUpdateProduct = [
  check("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El título no puede estar vacío"),

  check("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("El precio debe ser un número válido"),

  check("stock")
    .optional()
    .isNumeric()
    .withMessage("El stock debe ser un número válido"),

  check("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La categoría no puede estar vacía"),

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
