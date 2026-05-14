import getUserByIdDAL from "./data-access-layer/getUserByIdDAL.js";

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getUserByIdDAL(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json(result.user);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default getUserById;
