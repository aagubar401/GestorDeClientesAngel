import db from "../../../models/db.js";
const User = db.user;

const deleteAvatarDAL = async ({ id }) => {
  return await User.update({ avatar: null }, { where: { id } });
};

export default deleteAvatarDAL;
