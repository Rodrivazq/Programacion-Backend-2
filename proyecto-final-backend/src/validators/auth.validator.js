import { check, validationResult } from 'express-validator';

export const validateRegister = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  check('email').isEmail().withMessage('Debe ser un email válido'),
  check('password').notEmpty().withMessage('La contraseña es requerida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
