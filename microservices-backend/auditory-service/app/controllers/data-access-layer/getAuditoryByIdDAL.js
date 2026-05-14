import db from "../../models/db.js";

const Auditory = db.auditory;

const getAuditoryByIdDAL = async (id) => {
  try {
    const auditory = await Auditory.findOne({ where: { id } });

    if (!auditory) {
      return { error: "Registro de auditoría no encontrado" };
    }

    return { auditory };
  } catch (error) {
    return { error: error.message };
  }
};

export default getAuditoryByIdDAL;
