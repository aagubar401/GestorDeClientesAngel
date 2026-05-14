import createCustomerDAL from "./data-access-layer/createCustomerDAL.js";

const createCustomer = async (req, res, next) => {
  

  try {
    const userId = req.userId;
    const userEmail = req.userEmail;
    const { name, taxId, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const context = { name, taxId, email, phone, address, userId };
    const result = await createCustomerDAL(context);

    try {
      const res = await fetch("http://auditory-service:3700/audit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization, // reenviamos el token
        },
        body: JSON.stringify({
          action: "customer.created",
          entityType: "customer",
          entityId: result.newCustomer.id,
          serviceName: "customers-service",
          description: "Se creó un nuevo cliente",
          metadata: {
            customerName: result.newCustomer.name,
          },
          userIdSend: userId,
          userEmailSend: userEmail,

        })
      });
      
    } catch (auditError) {
      console.error("Error en el envío de auditoria", auditError)
    }
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Cliente creado correctamente",
      customer: result.newCustomer,
    });
  } catch (error) {
    next(error);
  }
};

export default createCustomer;
