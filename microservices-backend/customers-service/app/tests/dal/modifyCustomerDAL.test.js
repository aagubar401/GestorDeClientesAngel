import modifyCustomerDAL from "../../controllers/data-access-layer/modifyCustomerDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findOne: jest.fn(),
    },
    Sequelize: {
      Op: { or: "OR", ne: "NE" },
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: modifyCustomerDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve error si falta id", async () => {
    const result = await modifyCustomerDAL({ id: null, userId: 5 });
    expect(result.error).toBe("Id no proporcionado");
  });

  test("devuelve error si falta userId", async () => {
    const result = await modifyCustomerDAL({ id: 10, userId: null });
    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve error si el DNI es inválido", async () => {
    const result = await modifyCustomerDAL({
      id: 10,
      userId: 5,
      taxId: "12345678A", // inválido
    });

    expect(result.error).toBe("El DNI no es válido.");
  });

  test("devuelve error si el teléfono es inválido", async () => {
    const result = await modifyCustomerDAL({
      id: 10,
      userId: 5,
      phone: "12345", // inválido
    });

    expect(result.error).toBe("El telefono no es válido.");
  });

  test("devuelve error si el cliente no existe o no pertenece al usuario", async () => {
    db.customers.findOne.mockResolvedValue(null);

    const result = await modifyCustomerDAL({
      id: 10,
      userId: 5,
      name: "Nuevo",
    });

    expect(db.customers.findOne).toHaveBeenCalledWith({
      where: { id: 10, userId: 5 },
    });

    expect(result.error).toBe(
      "Cliente no encontrado o no pertenece al usuario",
    );
  });

  test("actualiza el cliente correctamente", async () => {
    const mockCustomer = {
      id: 10,
      update: jest.fn(),
    };

    db.customers.findOne.mockResolvedValue(mockCustomer);

    const result = await modifyCustomerDAL({
      id: 10,
      userId: 5,
      name: "Nuevo Nombre",
      taxId: "12345678Z",
      email: "nuevo@test.com",
      phone: "666777888",
      address: "Nueva dirección",
      status: true,
    });

    expect(mockCustomer.update).toHaveBeenCalled();

    expect(result).toEqual({ customer: mockCustomer });
  });
});
