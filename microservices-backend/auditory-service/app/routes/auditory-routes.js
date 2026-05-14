import createAuditory from "../controllers/createAuditory.js";
import listAuditories from "../controllers/listAuditories.js";
import getAuditoryById from "../controllers/getAuditoryById.js";
import verifyToken from "../middlewares/authorizeJWT.js";
const auditoryRoutes = (app) => {
  app.get("/prueba", (req, res, next) => {
    res
      .status(200)
      .json({ welcomeMessage: `¡Hola desde el servicio de auditoria!` });
  });

  app.get("/prueba/error", (req, res, next) => {
    try {
      throw new Error("Este es un error de prueba");
    } catch (err) {
      next(err);
    }
  });
  app.post("/audit-logs", createAuditory)
  app.get("/audit-logs", listAuditories)
  app.get("/audit-logs/:id", getAuditoryById)
};

export default auditoryRoutes;
