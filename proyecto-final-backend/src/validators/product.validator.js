import { check, validationResult } from 'express-validator';

// 📦 Validación para crear producto
export const validateCreateProduct = [
  check('nombre')
    .notEmpty()
    .withMessage('El nombre del producto es requerido'),

  check('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isNumeric()
    .withMessage('El precio debe ser un número'),

  check('descripcion')
    .notEmpty()
    .withMessage('La descripción es requerida'),

  check('categoria')
    .notEmpty()
    .withMessage('La categoría es requerida'),

  // Middleware de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// 🛠️ Validación para actualizar producto (campos opcionales)
export const validateUpdateProduct = [
  check('nombre')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),

  check('precio')
    .optional()
    .isNumeric()
    .withMessage('El precio debe ser un número'),

  check('descripcion')
    .optional()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía'),

  check('categoria')
    .optional()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía'),

  // Middleware de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
