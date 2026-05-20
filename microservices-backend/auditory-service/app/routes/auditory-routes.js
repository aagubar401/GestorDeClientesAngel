import createAuditory from "../controllers/createAuditory.js";
import listAuditories from "../controllers/listAuditories.js";
import getAuditoryById from "../controllers/getAuditoryById.js";
import verifyToken from "../middlewares/authorizeJWT.js";
import getCustomerModifiedHistory from "../controllers/getCustomerModifiedHistory.js";
import getUserModifiedHistory from "../controllers/getUserModifiedHistory.js";
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
  app.get("/audit-logs/customers/:customerId/history", getCustomerModifiedHistory)
  app.get("/audit-logs/users/:userId/history", getUserModifiedHistory);
};

export default auditoryRoutes;
