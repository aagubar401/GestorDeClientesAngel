// app/controllers/users/data-access-layer/getUserDAL.js
import db from "../../../models/db.js";

const User = db.user;

const getUserDAL = async ({ id }) => {
  if (!id) throw new Error("ID de usuario es requerido");

  const user = await User.findByPk(id, {
    attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
  });

  if (!user) throw new Error("Usuario no encontrado");

  return { user: user.dataValues };
};

export default getUserDAL;
