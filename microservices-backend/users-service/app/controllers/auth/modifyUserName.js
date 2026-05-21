import db from "../../models/db.js";
import modifyUserNameDAL from "./data-access-layer/modifyUserNameDAL.js";
import sendAudit from "../../utils/sendAudit.js";

const User = db.user;

const modifyUserName = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || name.trim() === "")
      return res.status(400).json({ error: "El nombre no puede estar vacío" });

    const oldUser = await User.findByPk(userId);
    if (!oldUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const result = await modifyUserNameDAL({ userId, name });
    if (oldUser.name === result.user.name) {
      return res.status(200).json({
        message: "El nombre es el mismo que el actual",
        user: result.user,
      });
    }
    await sendAudit({
      url: "http://auditory-service:3700/audit-logs",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: {
        action: "user.modified",
        entityType: "user",
        entityId: userId,
        serviceName: "users-service",
        description: "Se modificó el nombre de un usuario",
        metadata: {
          oldUserName: oldUser.name,
          newUserName: result.user.name,
        },
        userIdSend: userId,
        userEmailSend: oldUser.email,
      },
    });

    return res.status(200).json({
      message: "Nombre actualizado correctamente",
      user: result.user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export default modifyUserName;
