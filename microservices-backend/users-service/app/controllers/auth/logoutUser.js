import db from "../../models/db.js";
import logoutUserDAL from "./data-access-layer/logoutUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";

const User = db.user;

const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const oldUser = await User.findByPk(userId);
    if (!oldUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

    await logoutUserDAL({ id: userId });

    await sendAudit({
      url: "http://auditory-service:3700/audit-logs",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: {
        action: "user.logout",
        entityType: "user",
        entityId: userId,
        serviceName: "users-service",
        description: "Se cerró sesión",
        metadata: {
          userName: oldUser.name,
          userEmail: oldUser.email,
          userRole: oldUser.role,
        },
        userIdSend: userId,
        userEmailSend: oldUser.email,
      },
    });

    return res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export default logoutUser;
