// app/controllers/auth/data-access-layer/registerUserDAL.js
import bcrypt from "bcrypt";
import db from "../../../models/db.js";

const User = db.user; // 🔥 CORREGIDO

const registerUserDAL = async ({
  name,
  email,
  password,
  repeatPassword,
  role,
}) => {
  if (!name || !email || !password || !repeatPassword) {
    throw new Error("Faltan campos obligatorios.");
  }

  if (password.length < 6) {
    throw new Error("La contraseña debe tener mínimo 6 caracteres");
  }

  if (password !== repeatPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  return { user: newUser.dataValues }; // 🔥 coherente con el resto del servicio
};

export default registerUserDAL;
