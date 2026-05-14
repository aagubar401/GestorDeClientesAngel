import db from "../../../models/db.js";

const User = db.user;

const getUserByIdDAL = async (id) => {
  if (!id) {
    return { error: "Id no encontrado" };
  }
  const user = await User.findByPk(id, {
    attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
  });
  
  if (!user) {
    return { error: "Usuario no encontrado" };
  }

  return { user: user.dataValues };
};

export default getUserByIdDAL;
