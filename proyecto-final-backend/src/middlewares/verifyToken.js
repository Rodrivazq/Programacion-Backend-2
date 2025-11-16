import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        status: "error",
        message: "Token no proporcionado o con formato incorrecto",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET no está definido en las variables de entorno");
      return res.status(500).json({
        status: "error",
        message: "Faltan configuraciones del servidor",
      });
    }

    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error en verifyToken:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "El token ha expirado, inicia sesión nuevamente",
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Token inválido o no autorizado",
    });
  }
};
