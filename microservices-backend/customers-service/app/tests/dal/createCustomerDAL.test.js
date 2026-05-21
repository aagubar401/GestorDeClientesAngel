import createCustomerDAL from "../../controllers/data-access-layer/createCustomerDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Sequelize: {
      Op: { or: "OR" },
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: createCustomerDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve error si falta userId", async () => {
    const result = await createCustomerDAL({
      name: "Test",
      userId: null,
    });

    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve error si el DNI es inválido", async () => {
    const result = await createCustomerDAL({
      name: "Test",
      taxId: "12345678A", // inválido
      userId: 5,
    });

    expect(result.error).toBe("El DNI no es válido.");
  });

  test("devuelve error si el teléfono es inválido", async () => {
    const result = await createCustomerDAL({
      name: "Test",
      phone: "12345", // inválido
      userId: 5,
    });

    expect(result.error).toBe("El telefono no es válido.");
  });

  test("crea un cliente correctamente cuando los datos son válidos", async () => {
    const mockCustomer = { id: 1, name: "Test" };

    db.customers.findOne.mockResolvedValue(null);
    db.customers.create.mockResolvedValue(mockCustomer);

    const result = await createCustomerDAL({
      name: "Test",
      taxId: "12345678Z", // válido
      email: "test@test.com",
      phone: "666777888",
      address: "Calle Falsa",
      userId: 5,
    });

    expect(db.customers.create).toHaveBeenCalled();

    expect(result).toEqual({ newCustomer: mockCustomer });
  });

  test("devuelve error si Sequelize lanza excepción", async () => {
    db.customers.findOne.mockRejectedValue(new Error("DB error"));

    const result = await createCustomerDAL({
      name: "Test",
      userId: 5,
    });

    expect(result.error).toBe("DB error");
  });
});
