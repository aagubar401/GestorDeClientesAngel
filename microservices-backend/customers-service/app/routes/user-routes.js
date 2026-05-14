import verifyToken from "../middlewares/verifyToken.js";
import listCustomers from "../controllers/listCustomers.js";
import createCustomer from "../controllers/createCustomer.js";
import deleteCustomer from "../controllers/deleteCustomer.js";
import modifyCustomer from "../controllers/modifyCustomer.js";
import consultCustomer from "../controllers/consultCustomer.js";
const userRoutes = (app) => {
  app.get("/prueba", (req, res) => {
    res
      .status(200)
      .json({ welcomeMessage: "¡Hola desde el servicio de clientes!" });
  });
  app.get("/prueba/error", (req, res, next) => {
    try {
      throw new Error("Este es un error de prueba");
    } catch (err) {
      next(err);
    }
  });
  app.get("/customers", verifyToken, listCustomers);
  app.post("/customers", verifyToken, createCustomer);
  app.delete("/customers/:id", verifyToken, deleteCustomer);
  app.put("/customers/:id", verifyToken, modifyCustomer);
  app.get("/customers/:id", verifyToken, consultCustomer);
};
export default userRoutes;
