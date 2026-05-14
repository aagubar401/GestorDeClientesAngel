import loginUserDAL from "./data-access-layer/loginUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUserDAL({ email, password });

    await sendAudit({
      url: "http://auditory-service:3700/audit-logs",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: "user.login",
        entityType: "user",
        entityId: user.id,
        serviceName: "users-service",
        description: "Se inició sesión",
        metadata: {
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
        },
        userIdSend: user.id,
        userEmailSend: user.email
      },
    });

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export default loginUser;
