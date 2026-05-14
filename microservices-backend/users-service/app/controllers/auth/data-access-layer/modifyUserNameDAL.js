// app/controllers/auth/data-access-layer/modifyUserNameDAL.js
import db from "../../../models/db.js";

const User = db.user; // 🔥 CORREGIDO

const modifyUserNameDAL = async ({ userId, name }) => {
  if (!userId) return { error: "Usuario no proporcionado" };

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return { error: "Usuario no encontrado" };
  }

  await user.update({
    name: name.trim(),
    updatedAt: new Date(),
  });

  return { user: user.dataValues };
};

export default modifyUserNameDAL;
