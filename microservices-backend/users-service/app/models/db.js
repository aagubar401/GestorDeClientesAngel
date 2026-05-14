// app/models/db.js
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database/createDB.js";
import dbUsers from "./user.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = dbUsers(sequelize, DataTypes);

// 🔥 nombre correcto y unificado
db.user = User;

export default db;
