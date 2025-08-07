import { body } from 'express-validator';

export const registerValidator = [
  body('nombre', 'El nombre es obligatorio').notEmpty(),
  body('email', 'El email debe ser válido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
];

export const loginValidator = [
  body('email', 'El email debe ser válido').isEmail(),
  body('password', 'La contraseña es obligatoria').notEmpty(),
];
