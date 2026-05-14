//import modules
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../database/createDB.js";
import dbCustomers from "./customer.js";

//connecting to model
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Customer = dbCustomers(sequelize, DataTypes);

db.customers = Customer;

db.models = { Customer };

//exporting the module
export default db;
