// app/controllers/users/getUser.js
import getUserDAL from "./data-access-layer/getUserDAL.js";

const getUser = async (req, res) => {
  try {
    const id = req.user.id;

    const { user } = await getUserDAL({ id });

    return res.status(200).json({
      message: "Usuario encontrado",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export default getUser;
