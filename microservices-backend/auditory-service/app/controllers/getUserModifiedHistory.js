import getUserModifiedHistoryDAL from "./data-access-layer/getUserModifiedHistoryDAL.js";

const getUserModifiedHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await getUserModifiedHistoryDAL(userId);

    return res.status(200).json({
      message: "Historial de modificaciones del usuario obtenido correctamente",
      history,
    });
  } catch (error) {
    console.error("Error obteniendo historial de usuario:", error);
    return res.status(500).json({
      error: error.message || "Error interno obteniendo historial del usuario",
    });
  }
};

export default getUserModifiedHistory;
