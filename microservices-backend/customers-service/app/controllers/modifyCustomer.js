import modifyCustomerDAL from "./data-access-layer/modifyCustomerDAL.js";
import db from "../models/db.js";
const Customer = db.customers;


const modifyCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, taxId, email, phone, address, status } = req.body; // <-- AÑADIDO
    const userId = req.userId;
    const userEmail = req.userEmail;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const oldCustomer = await Customer.findByPk(id);

    if (!oldCustomer) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const context = { id, userId, name, taxId, email, phone, address, status }; // <-- AÑADIDO
    const result = await modifyCustomerDAL(context);
    if (oldCustomer.name === result.customer.name &&
        oldCustomer.taxId === result.customer.taxId &&
        oldCustomer.email === result.customer.email &&
        oldCustomer.phone === result.customer.phone &&
        oldCustomer.address === result.customer.address &&
        oldCustomer.status === result.customer.status) {
      return res.status(200).json({
        message: "Los datos son los mismos que los actuales",
        customer: result.customer,
      });
    }
    try {
      await fetch("http://auditory-service:3700/audit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization, // reenviamos el token
        },
        body: JSON.stringify({
          action: "customer.modified",
          entityType: "customer",
          entityId: result.customer.id,
          serviceName: "customers-service",
          description: "Se modificaron los datos de un cliente",
          metadata: {
            old: {
              name: oldCustomer.name,
              taxId: oldCustomer.taxId,
              email: oldCustomer.email,
              phone: oldCustomer.phone,
              address: oldCustomer.address,
              status: oldCustomer.status,
            },
            new: {
              name: result.customer.name,
              taxId: result.customer.taxId,
              email: result.customer.email,
              phone: result.customer.phone,
              address: result.customer.address,
              status: result.customer.status,
            },
          },
          userIdSend: userId,
          userEmailSend: userEmail,
        }),
      });
      
    } catch (auditError) {
      console.error("Error en el envío de auditoria", auditError);
    }
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "Cliente modificado correctamente",
      customer: result.customer,
    });
  } catch (error) {
    next(error);
  }
};

export default modifyCustomer;
