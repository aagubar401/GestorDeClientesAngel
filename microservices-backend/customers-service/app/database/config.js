import dotenvconf from "dotenv";
const dotenv = dotenvconf.config();

export default {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "customers_service",
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
};
