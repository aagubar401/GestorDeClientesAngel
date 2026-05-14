import fs from "fs";
import path from "path";
import db from "../../models/db.js";
import deleteAvatarDAL from "./data-access-layer/deleteAvatarDAL.js";
import sendAudit from "../../utils/sendAudit.js";

const User = db.user;

const deleteAvatar = async (req, res) => {
  try {
    const userId = req.params.id; // usuario afectado
    const actorId = req.user.id; // usuario que hace la acción
    const actorEmail = req.user.email; // email del actor

    const user = await User.findByPk(userId);

    if (!user || !user.avatar) {
      return res.json({ message: "El usuario no tenía avatar" });
    }

    const fullPath = path.join(process.cwd(), user.avatar);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await deleteAvatarDAL({ id: userId });

    await sendAudit({
      url: "http://auditory-service:3700/audit-logs",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: {
        action: "avatar.deleted",
        entityType: "user",
        entityId: userId,
        serviceName: "users-service",
        description: "Se eliminó el avatar del usuario",
        metadata: {
          userName: user.name,
          userEmail: user.email, // usuario afectado
        },
        userIdSend: actorId, // usuario que realiza la acción
        userEmailSend: actorEmail, // email del actor
      },
    });

    res.json({ message: "Avatar eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error eliminando avatar" });
  }
};

export default deleteAvatar;
