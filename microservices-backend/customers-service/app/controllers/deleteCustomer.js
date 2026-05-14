import deleteCustomerDAL from "./data-access-layer/deleteCustomerDAL.js";
import db from "../models/db.js";
const Customer = db.customers;

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userEmail = req.userEmail;
    const oldCustomer = await Customer.findByPk(id);
    const context = { id, userId };
    const result = await deleteCustomerDAL(context);
    try {
      await fetch("http://auditory-service:3700/audit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization, // reenviamos el token
        },
        body: JSON.stringify({
          action: "customer.deleted",
          entityType: "customer",
          entityId: id,
          serviceName: "customers-service",
          description: "Se eliminó un cliente",
          metadata: {
            customerName: oldCustomer.name,
          },
          userIdSend: userId,
          userEmailSend: userEmail,
        }),
      });
      
    } catch (auditError) {
      console.error("Error en el envío de auditoria", auditError);
    }
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Cliente eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export default deleteCustomer;
