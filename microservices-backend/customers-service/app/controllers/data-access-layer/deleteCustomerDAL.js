import db from "../../models/db.js";

const Customer = db.customers;

const deleteCustomerDAL = async ({ id, userId }) => {
  if (!id) {
    return { error: "Id no proporcionado" };
  }

  if (!userId) {
    return { error: "Usuario no proporcionado" };
  }

  // 1. Buscar el cliente y comprobar que pertenece al usuario
  const customer = await Customer.findOne({
    where: {
      id,
      userId,
    },
  });

  if (!customer) {
    return { error: "Cliente no encontrado o no pertenece al usuario" };
  }

  // 2. Eliminarlo
  await customer.destroy();

  return { success: true };
};

export default deleteCustomerDAL;
