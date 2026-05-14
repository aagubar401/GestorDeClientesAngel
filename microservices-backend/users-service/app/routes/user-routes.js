import createUser from "../controllers/auth/createUser.js";
import loginUser from "../controllers/auth/loginUser.js";
import verifyToken from "../middlewares/authorizeJWT.js";
import getAllUsers from "../controllers/users/getAllUsers.js";
import getUser from "../controllers/users/getUser.js";
import logoutUser from "../controllers/auth/logoutUser.js";
import modifyUserName from "../controllers/auth/modifyUserName.js";
import getUserById from "../controllers/users/getUserById.js";

import uploadAvatar from "../controllers/users/uploadAvatar.js";
import deleteAvatar from "../controllers/users/deleteAvatar.js";

const userRoutes = (app) => {
  app.get("/prueba", (req, res, next) => {
    res
      .status(200)
      .json({ welcomeMessage: `¡Hola desde el servicio de usuarios!` });
  });

  app.get("/prueba/error", (req, res, next) => {
    try {
      throw new Error("Este es un error de prueba");
    } catch (err) {
      next(err);
    }
  });

  // Registro
  app.post("/users/register", createUser);

  // Login
  app.post("/users/login", loginUser);

  // Obtener usuario
  app.get("/users", getAllUsers);
  app.get("/users/me", verifyToken, getUser);
  app.get("/users/:id", getUserById);

  // Cerrar sesión
  app.post("/users/logout", verifyToken, logoutUser);

  // Modificar nombre
  app.put("/users/name", verifyToken, modifyUserName);

  // Avatar
  app.post("/users/:id/avatar", verifyToken, uploadAvatar);
  app.delete("/users/:id/avatar", verifyToken, deleteAvatar);
};

export default userRoutes;
