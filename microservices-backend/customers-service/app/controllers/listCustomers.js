import listCustomersDAL from "./data-access-layer/listCustomersDAL.js";

const listCustomers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const context = { userId };
    const result = await listCustomersDAL(context);

    return res.status(200).json({
      message: "Listado filtrado correctamente",
      customers: result.customers,
    });
  } catch (error) {
    next(error);
  }
};

export default listCustomers;
