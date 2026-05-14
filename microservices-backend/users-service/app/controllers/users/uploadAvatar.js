import multer from "multer";
import fs from "fs";
import path from "path";
import uploadAvatarDAL from "./data-access-layer/uploadAvatarDAL.js";
import db from "../../models/db.js";
import sendAudit from "../../utils/sendAudit.js";

const User = db.user;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.id;
    const dir = path.join(process.cwd(), "public", "usuarios", userId);

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `avatar.${ext}`);
  },
});

const upload = multer({ storage }).single("avatar");

const uploadAvatar = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Error subiendo archivo" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen" });
      }

      const userId = req.params.id; // usuario afectado
      const actorId = req.user.id; // usuario que hace la acción
      const actorEmail = req.user.email; // email del actor

      const avatarPath = `/public/usuarios/${userId}/${req.file.filename}`;
      const user = await User.findByPk(userId);

      await uploadAvatarDAL({ id: userId, avatarPath });

      await sendAudit({
        url: "http://auditory-service:3700/audit-logs",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization,
        },
        body: {
          action: "avatar.uploaded",
          entityType: "user",
          entityId: userId,
          serviceName: "users-service",
          description: "Se actualizó el avatar del usuario",
          metadata: {
            userName: user.name,
            userEmail: user.email, // usuario afectado
          },
          userIdSend: actorId, // usuario que realiza la acción
          userEmailSend: actorEmail, // email del actor
        },
      });

      res.json({
        message: "Avatar actualizado correctamente",
        avatar: avatarPath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al subir avatar" });
    }
  });
};

export default uploadAvatar;
