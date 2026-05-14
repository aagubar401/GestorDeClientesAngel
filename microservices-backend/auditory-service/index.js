import express from "express";
import db from "./app/database/createDB.js";
import cors from "cors";
import setRoutes from "./app/routes/index.js";
import logRequest from "./app/middlewares/logRequest.js";
import handleError from "./app/middlewares/handleError.js";

const PORT = process.env.PORT || 3700;

const app = express();
app.disable("etag");

app.use(cors({ origin: ["http://localhost:5178"] }));
app.use(express.json());
app.use(logRequest);

setRoutes(app);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Servidor de auditoria escuchando en el puerto ${PORT}`);
});
