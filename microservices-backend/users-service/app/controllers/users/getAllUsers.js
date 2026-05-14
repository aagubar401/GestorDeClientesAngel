import getAllUsersDAL from "./data-access-layer/getAllUsersDAL.js";

const getAllUsers = async (req, res, next) => {
  try {
    const result = await getAllUsersDAL();

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ users: result.users });
  } catch (err) {
    next(err);
  }
};

export default getAllUsers;
