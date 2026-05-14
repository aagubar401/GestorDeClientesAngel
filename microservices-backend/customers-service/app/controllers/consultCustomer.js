import consultCustomerDAL from "./data-access-layer/consultCustomerDAL.js";

const consultCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const context = { id, userId };
    const result = await consultCustomerDAL(context);

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({ customer: result.customer });
  } catch (error) {
    next(error);
  }
};

export default consultCustomer;
