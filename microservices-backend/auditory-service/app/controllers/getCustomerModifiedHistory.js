import getCustomerModifiedHistoryDAL from "./data-access-layer/getCustomerModifiedHistoryDAL.js";

const getCustomerModifiedHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const history = await getCustomerModifiedHistoryDAL(customerId);

    return res.status(200).json({
      message: "Historial de modificaciones obtenido correctamente",
      history,
    });
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return res.status(500).json({
      error: error.message || "Error interno obteniendo historial",
    });
  }
};

export default getCustomerModifiedHistory;
