import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Falta el token en el header Authorization.",
      });
    }

    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET no definido en el entorno");
      return res.status(500).json({
        status: "error",
        message: "Configuración del servidor incompleta.",
      });
    }

    // Verificación del token
    const decoded = jwt.verify(token, secret);

    // Normaliza el campo que representa el ID
    const normalizedId =
      decoded.userId || decoded.id || decoded._id || decoded.uid;

    if (!normalizedId) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido: no contiene ID de usuario.",
      });
    }

    // Datos del usuario para el request
    req.user = {
      id: normalizedId.toString(),
      email: decoded.email || null,
      rol: decoded.rol || "usuario",
    };

    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err.message);
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado.",
    });
  }
};
