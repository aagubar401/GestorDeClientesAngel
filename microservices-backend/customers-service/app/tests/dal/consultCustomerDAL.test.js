import consultCustomerDAL from "../../controllers/data-access-layer/consultCustomerDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findOne: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: consultCustomerDAL", () => {
  test("devuelve error si falta id", async () => {
    const result = await consultCustomerDAL({ id: null, userId: 5 });
    expect(result.error).toBe("Id no proporcionado");
  });

  test("devuelve error si falta userId", async () => {
    const result = await consultCustomerDAL({ id: 10, userId: null });
    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve error si el cliente no existe o no pertenece al usuario", async () => {
    db.customers.findOne.mockResolvedValue(null);

    const result = await consultCustomerDAL({ id: 10, userId: 5 });

    expect(db.customers.findOne).toHaveBeenCalledWith({
      where: { id: 10, userId: 5 },
    });

    expect(result.error).toBe(
      "Cliente no encontrado o no pertenece al usuario",
    );
  });

  test("devuelve el cliente si existe y pertenece al usuario", async () => {
    const mockCustomer = { id: 10, name: "Cliente Test", userId: 5 };

    db.customers.findOne.mockResolvedValue(mockCustomer);

    const result = await consultCustomerDAL({ id: 10, userId: 5 });

    expect(result).toEqual({ customer: mockCustomer });
  });
});
