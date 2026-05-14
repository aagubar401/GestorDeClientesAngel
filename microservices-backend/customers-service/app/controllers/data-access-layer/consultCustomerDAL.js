import db from "../../models/db.js";

const Customer = db.customers;

const consultCustomerDAL = async ({ id, userId }) => {
  if (!id) return { error: "Id no proporcionado" };
  if (!userId) return { error: "Usuario no proporcionado" };

  const customer = await Customer.findOne({
    where: { id, userId },
  });

  if (!customer) {
    return { error: "Cliente no encontrado o no pertenece al usuario" };
  }

  return { customer };
};

export default consultCustomerDAL;
