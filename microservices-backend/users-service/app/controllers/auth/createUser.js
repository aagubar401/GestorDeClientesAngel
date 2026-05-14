import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.config.js";
import registerUserDAL from "./data-access-layer/registerUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password, repeatPassword, role } = req.body;

    const result = await registerUserDAL({
      name,
      email,
      password,
      repeatPassword,
      role,
    });

    if (result.error) return res.status(400).json({ error: result.error });

    const user = result.user;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      authConfig.secret,
      { expiresIn: "24h" },
    );

    await sendAudit({
      url: "http://auditory-service:3700/audit-logs",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: "user.register",
        entityType: "user",
        entityId: user.id,
        serviceName: "users-service",
        description: "Se registró un nuevo usuario",
        metadata: {
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
        },
        userIdSend: user.id,
        userEmailSend: user.email,
      },
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear usuario" });
  }
};

export default createUser;
