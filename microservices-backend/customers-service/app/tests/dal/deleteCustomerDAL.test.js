import deleteCustomerDAL from "../../controllers/data-access-layer/deleteCustomerDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findOne: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: deleteCustomerDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve error si falta id", async () => {
    const result = await deleteCustomerDAL({ id: null, userId: 5 });
    expect(result.error).toBe("Id no proporcionado");
  });

  test("devuelve error si falta userId", async () => {
    const result = await deleteCustomerDAL({ id: 10, userId: null });
    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve error si el cliente no existe o no pertenece al usuario", async () => {
    db.customers.findOne.mockResolvedValue(null);

    const result = await deleteCustomerDAL({ id: 10, userId: 5 });

    expect(db.customers.findOne).toHaveBeenCalledWith({
      where: { id: 10, userId: 5 },
    });

    expect(result.error).toBe(
      "Cliente no encontrado o no pertenece al usuario",
    );
  });

  test("elimina el cliente si existe y pertenece al usuario", async () => {
    const mockCustomer = {
      id: 10,
      destroy: jest.fn(),
    };

    db.customers.findOne.mockResolvedValue(mockCustomer);

    const result = await deleteCustomerDAL({ id: 10, userId: 5 });

    expect(mockCustomer.destroy).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
