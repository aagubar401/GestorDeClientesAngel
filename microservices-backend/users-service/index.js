import db from "./app/database/createDB.js";

import express from "express";
import cors from "cors";
import setRoutes from "./app/routes/index.js";
import logRequest from "./app/middlewares/logRequest.js";
import handleError from "./app/middlewares/handleError.js";
const PORT = process.env.PORT || 3400;

const app = express();
app.disable("etag");
app.use(cors({ origin: ["http://localhost:5178", "https://clientgestor.netlify.app/"] }));
app.use(express.json());
app.use("/public", express.static("public"));

app.use(logRequest);

setRoutes(app);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Servidor de usuarios escuchando en el puerto ${PORT}`);
});
