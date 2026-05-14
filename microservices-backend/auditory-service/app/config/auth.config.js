import dotenv from "dotenv";

const authConfig = dotenv.config();

export default {
  secret: process.env.AUTH_SECRET,
};