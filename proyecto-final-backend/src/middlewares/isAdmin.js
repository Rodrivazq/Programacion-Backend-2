export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado. Se requiere un token válido.",
      });
    }

    if (req.user.rol !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado. Permisos insuficientes.",
      });
    }

    next();
  } catch (error) {
    console.error("Error en middleware isAdmin:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error al verificar permisos.",
    });
  }
};
