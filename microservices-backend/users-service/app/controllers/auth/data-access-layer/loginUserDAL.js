// app/controllers/auth/data-access-layer/loginUserDAL.js
import jwt from "jsonwebtoken";
import authConfig from "../../../config/auth.config.js";
import bcrypt from "bcrypt";
import db from "../../../models/db.js";

const User = db.user; // 🔥 CORREGIDO

const loginUserDAL = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Faltan campos obligatorios.");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    authConfig.secret,
    { expiresIn: "24h" },
  );

  if (!user.active) {
    await user.update({ active: true });
  }

  return { user: user.dataValues, token };
};

export default loginUserDAL;
