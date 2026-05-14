//import modules
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database/createDB.js";
import dbAuditory from "./auditory.js";

//connecting to model
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Auditory = dbAuditory(sequelize, DataTypes);

db.auditory = Auditory;

db.models = { Auditory };

//exporting the module
export default db;
