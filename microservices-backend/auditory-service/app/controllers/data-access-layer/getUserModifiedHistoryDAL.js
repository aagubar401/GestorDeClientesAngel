import db from "../../models/db.js";

const Auditory = db.auditory;

const getUserModifiedHistoryDAL = async (userId) => {
  if (!userId) {
    throw new Error("Falta el ID del usuario");
  }

  const logs = await Auditory.findAll({
    where: {
      action: "user.modified",
      entityType: "user",
      entityId: userId,
    },
    order: [["createdAt", "DESC"]],
  });

  return logs;
};

export default getUserModifiedHistoryDAL;
