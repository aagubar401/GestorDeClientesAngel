import express from "express";
import db from "./app/database/createDB.js";
import cors from "cors";
import handleError from "./app/middlewares/handleError.js";
import setRoutes from "./app/routes/index.js";
const PORT = process.env.PORT || 3900;

const app = express();
app.disable("etag");
app.use(cors({ origin: ["http://localhost:5178"] }));
app.use(express.json());
setRoutes(app);
app.use(handleError);
app.listen(PORT, () => {
  console.log(`Servidor de clientes escuchando en el puerto ${PORT}`);
});
