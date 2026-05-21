import listCustomersDAL from "../../controllers/data-access-layer/listCustomersDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findAll: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: listCustomersDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve error si falta userId", async () => {
    const result = await listCustomersDAL({ userId: null });
    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve listado de clientes si userId es válido", async () => {
    const mockCustomers = [
      { id: 1, name: "Cliente 1" },
      { id: 2, name: "Cliente 2" },
    ];

    db.customers.findAll.mockResolvedValue(mockCustomers);

    const result = await listCustomersDAL({ userId: 5 });

    expect(db.customers.findAll).toHaveBeenCalledWith({
      where: { userId: 5 },
      order: [["id", "ASC"]],
    });

    expect(result).toEqual({ customers: mockCustomers });
  });
});
