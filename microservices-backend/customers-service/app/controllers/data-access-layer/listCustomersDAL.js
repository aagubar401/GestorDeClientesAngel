// controllers/data-access-layer/listCustomersDAL.js
import db from "../../models/db.js";

const Customer = db.customers;

const listCustomersDAL = async ({ userId }) => {
  if (!userId) {
    return { error: "Usuario no proporcionado" };
  }

  const customers = await Customer.findAll({
    where: { userId },
    order: [["id", "ASC"]],
  });

  return { customers };
};

export default listCustomersDAL;
