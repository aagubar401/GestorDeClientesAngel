import db from "../../models/db.js";

const Auditory = db.auditory;

const createAuditoryDAL = async ({
  userId,
  userEmail,
  action,
  entityType,
  entityId,
  serviceName,
  description,
  metadata,
}) => {
  try {
    if (!userId) {
      return { error: "El Id del usuario es obligatorio" };
    }
    const newAuditory = await Auditory.create({
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      serviceName,
      description,
      metadata,
    });

    return { newAuditory };
  } catch (error) {
    return { error: error.message };
  }
};

export default createAuditoryDAL;
