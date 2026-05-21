import deleteCustomer from "../../controllers/deleteCustomer.js";

jest.mock("../../controllers/data-access-layer/deleteCustomerDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import deleteCustomerDAL from "../../controllers/data-access-layer/deleteCustomerDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    customers: {
      findByPk: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

// Mock global fetch
global.fetch = jest.fn();

describe("Controller: deleteCustomer", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 10 },
      userId: 5,
      userEmail: "user@test.com",
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    db.customers.findByPk.mockResolvedValue({ id: 10, name: "Cliente Test" });
    fetch.mockResolvedValue({ ok: true });
  });

  test("devuelve 404 si el DAL devuelve error", async () => {
    deleteCustomerDAL.mockResolvedValue({
      error: "Cliente no encontrado o no pertenece al usuario",
    });

    await deleteCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Cliente no encontrado o no pertenece al usuario",
    });
  });

  test("devuelve 200 si el cliente se elimina correctamente", async () => {
    deleteCustomerDAL.mockResolvedValue({ success: true });

    await deleteCustomer(req, res, next);

    expect(deleteCustomerDAL).toHaveBeenCalledWith({
      id: "10",
      userId: 5,
    });

    expect(fetch).toHaveBeenCalled(); // auditoría enviada

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cliente eliminado correctamente",
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    deleteCustomerDAL.mockRejectedValue(fakeError);

    await deleteCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
