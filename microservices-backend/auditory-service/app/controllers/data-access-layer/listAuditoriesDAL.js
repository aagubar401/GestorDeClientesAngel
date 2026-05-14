import db from "../../models/db.js";

const Auditory = db.auditory;

const listAuditoriesDAL = async () => {
  try {
    const auditories = await Auditory.findAll({
      order: [["createdAt", "DESC"]],
    });

    return { auditories };
  } catch (error) {
    return { error: error.message };
  }
};

export default listAuditoriesDAL;
