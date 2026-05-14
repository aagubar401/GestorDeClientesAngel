import db from "../../models/db.js";

const Customer = db.customers;

function validarDNI(dni) {
  const regex = /^[0-9]{8}[A-Za-z]$/;
  if (!regex.test(dni)) return false;

  const numero = parseInt(dni.substring(0, 8), 10);
  const letra = dni.charAt(8).toUpperCase();
  const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
  const letraCorrecta = letras[numero % 23];

  return letra === letraCorrecta;
}

function validarPhone(phone) {
  const regex = /^[0-9]{9}$/;
  if (!regex.test(phone)) {
    return false;
  } else {
    return true;
  }
}

const createCustomerDAL = async ({
  name,
  taxId,
  email,
  phone,
  address,
  userId,
}) => {
  if (!userId) return { error: "Usuario no proporcionado" };

  // Normalizar valores vacíos
  const cleanTaxId = taxId?.trim() || null;
  const cleanEmail = email?.trim() || null;
  const cleanPhone = phone?.trim() || null;
  const cleanAddress = address?.trim() || null;

  // Validar DNI solo si viene informado
  if (cleanTaxId && !validarDNI(cleanTaxId)) {
    return { error: "El DNI no es válido." };
  }

  // Validar telefono solo si viene informado
  if (cleanPhone && !validarPhone(cleanPhone)) {
    return { error: "El telefono no es válido." };
  }

  // Comprobar duplicados solo con los campos enviados
  const orConditions = [];

  if (orConditions.length > 0) {
    const existing = await Customer.findOne({
      where: {
        [db.Sequelize.Op.or]: orConditions,
        userId,
      },
    });

    if (existing) {
      return { error: "Ya existe un cliente con ese DNI, email o teléfono" };
    }
  }

  const newCustomer = await Customer.create({
    name,
    taxId: cleanTaxId,
    email: cleanEmail,
    phone: cleanPhone,
    address: cleanAddress,
    userId,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { newCustomer };
};

export default createCustomerDAL;
