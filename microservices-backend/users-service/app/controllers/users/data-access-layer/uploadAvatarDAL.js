import db from "../../../models/db.js";
const User = db.user;

const uploadAvatarDAL = async ({ id, avatarPath }) => {
  return await User.update({ avatar: avatarPath }, { where: { id } });
};

export default uploadAvatarDAL;
