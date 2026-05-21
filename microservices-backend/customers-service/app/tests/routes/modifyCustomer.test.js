import modifyCustomer from "../../controllers/modifyCustomer.js";

jest.mock("../../controllers/data-access-layer/modifyCustomerDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import modifyCustomerDAL from "../../controllers/data-access-layer/modifyCustomerDAL.js";

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

describe("Controller: modifyCustomer", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 10 },
      body: {
        name: "Nuevo Nombre",
        taxId: "12345678Z",
        email: "nuevo@test.com",
        phone: "666777888",
        address: "Nueva dirección",
        status: true,
      },
      userId: 5,
      userEmail: "user@test.com",
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    db.customers.findByPk.mockResolvedValue({
      id: 10,
      name: "Viejo Nombre",
      taxId: "11111111H",
      email: "viejo@test.com",
      phone: "600000000",
      address: "Dirección vieja",
      status: true,
    });

    fetch.mockResolvedValue({ ok: true });
  });

  test("devuelve 400 si falta el nombre", async () => {
    req.body.name = "";

    await modifyCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "El nombre es obligatorio",
    });
  });

  test("devuelve 404 si el cliente no existe", async () => {
    db.customers.findByPk.mockResolvedValue(null);

    await modifyCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Cliente no encontrado",
    });
  });

  test("devuelve 400 si el DAL devuelve error", async () => {
    modifyCustomerDAL.mockResolvedValue({
      error: "Error de prueba",
    });

    await modifyCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error de prueba",
    });
  });

  test("devuelve 200 si el cliente se modifica correctamente", async () => {
    modifyCustomerDAL.mockResolvedValue({
      customer: { id: 10, name: "Nuevo Nombre" },
    });

    await modifyCustomer(req, res, next);

    expect(modifyCustomerDAL).toHaveBeenCalledWith({
      id: "10",
      userId: 5,
      name: "Nuevo Nombre",
      taxId: "12345678Z",
      email: "nuevo@test.com",
      phone: "666777888",
      address: "Nueva dirección",
      status: true,
    });

    expect(fetch).toHaveBeenCalled(); // auditoría enviada

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cliente modificado correctamente",
      customer: { id: 10, name: "Nuevo Nombre" },
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    modifyCustomerDAL.mockRejectedValue(fakeError);

    await modifyCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
