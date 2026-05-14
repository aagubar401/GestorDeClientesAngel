import getAuditoryByIdDAL from "./data-access-layer/getAuditoryByIdDAL.js";

const getAuditoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getAuditoryByIdDAL(id);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Detalle de auditoría obtenido correctamente",
      auditory: result.auditory,
    });
  } catch (error) {
    next(error);
  }
};

export default getAuditoryById;
