// app/controllers/auth/data-access-layer/logoutUserDAL.js
import db from "../../../models/db.js";

const User = db.user; // 🔥 CORREGIDO

const logoutUserDAL = async ({ id }) => {
  if (!id) {
    throw new Error("ID de usuario es requerido");
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  await user.update({ active: false });

  return true;
};

export default logoutUserDAL;
