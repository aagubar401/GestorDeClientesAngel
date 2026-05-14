import db from "../../../models/db.js";

const User = db.user;

const getAllUsersDAL = async () => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "active", "avatar"],
    });

    return { users };
  } catch (error) {
    return { error: error.message };
  }
};

export default getAllUsersDAL;
