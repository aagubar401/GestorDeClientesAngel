import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";

const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

export default verifyToken;
