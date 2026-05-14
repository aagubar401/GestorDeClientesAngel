import createAuditoryDAL from "./data-access-layer/createAuditoryDAL.js";

const createAuditory = async (req, res, next) => {
 
  
  try {
    const { action, entityType, entityId, description, metadata, serviceName, userIdSend, userEmailSend } =
      req.body;

    // Datos del usuario autenticado
    const userId = userIdSend;
    const userEmail = userEmailSend;


    const context = {
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      serviceName,
      description,
      metadata,
    };
    const result = await createAuditoryDAL(context);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Registro de auditoria creado correctamente",
      auditory: result.newAuditory,
    });
  } catch (error) {
    next(error);
  }
};

export default createAuditory;