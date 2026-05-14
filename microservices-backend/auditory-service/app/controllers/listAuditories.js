import listAuditoriesDAL from "./data-access-layer/listAuditoriesDAL.js";

const listAuditories = async (req, res, next) => {
  try {
    const result = await listAuditoriesDAL();

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Listado de auditorías obtenido correctamente",
      auditories: result.auditories,
    });
  } catch (error) {
    next(error);
  }
};

export default listAuditories;
