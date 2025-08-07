import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 🔐 Registrar usuario
export const registerUserService = async ({ nombre, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ nombre, email, password: hashedPassword });
  await newUser.save();

  return { message: 'Usuario registrado correctamente' };
};

// 🔑 Login de usuario
export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    token,
    user: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    }
  };
};

// 📋 Obtener todos los usuarios (sin password)
export const getAllUsersService = async () => {
  return await User.find().select('-password');
};

// 🔍 Obtener usuario por ID
export const getUserByIdService = async (id) => {
  return await User.findById(id).select('-password');
};

// ✏️ Actualizar usuario
export const updateUserService = async (id, data) => {
  const { nombre, email } = data;
  return await User.findByIdAndUpdate(id, { nombre, email }, { new: true }).select('-password');
};

// 🗑️ Eliminar usuario
export const deleteUserService = async (id) => {
  return await User.findByIdAndDelete(id);
};
