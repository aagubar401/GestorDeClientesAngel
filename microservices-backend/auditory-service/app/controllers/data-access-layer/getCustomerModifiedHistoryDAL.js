import db from "../../models/db.js";

const Auditory = db.auditory;

const getCustomerModifiedHistoryDAL = async (customerId) => {
  if (!customerId) {
    throw new Error("Falta el ID del cliente");
  }

  const logs = await Auditory.findAll({
    where: {
      action: "customer.modified",
      entityType: "customer",
      entityId: customerId,
    },
    order: [["createdAt", "DESC"]],
  });

  return logs;
};

export default getCustomerModifiedHistoryDAL;
