// app/middlewares/authorizeJWT.js
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

const authorizeJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    });
  } catch (error) {
    console.error("Error en authorizeJWT:", error);
    return res.status(500).json({ error: "Error al verificar token" });
  }
};

export default authorizeJWT;
