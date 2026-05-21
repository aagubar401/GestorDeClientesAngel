import createCustomer from "../../controllers/createCustomer.js";

jest.mock("../../controllers/data-access-layer/createCustomerDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import createCustomerDAL from "../../controllers/data-access-layer/createCustomerDAL.js";

// Mock global fetch para evitar llamadas reales
global.fetch = jest.fn();

describe("Controller: createCustomer", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: "Cliente Test",
        taxId: "12345678Z",
        email: "test@test.com",
        phone: "666777888",
        address: "Calle Falsa",
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

    fetch.mockResolvedValue({ ok: true });
  });

  test("devuelve 400 si falta el nombre", async () => {
    req.body.name = "";

    await createCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "El nombre es obligatorio",
    });
  });

  test("devuelve 400 si el DAL devuelve error", async () => {
    createCustomerDAL.mockResolvedValue({ error: "Error de prueba" });

    await createCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error de prueba" });
  });

  test("devuelve 201 si el cliente se crea correctamente", async () => {
    const mockCustomer = { id: 1, name: "Cliente Test" };

    createCustomerDAL.mockResolvedValue({ newCustomer: mockCustomer });

    await createCustomer(req, res, next);

    expect(createCustomerDAL).toHaveBeenCalledWith({
      name: "Cliente Test",
      taxId: "12345678Z",
      email: "test@test.com",
      phone: "666777888",
      address: "Calle Falsa",
      userId: 5,
    });

    expect(fetch).toHaveBeenCalled(); // auditoría enviada

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cliente creado correctamente",
      customer: mockCustomer,
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    createCustomerDAL.mockRejectedValue(fakeError);

    await createCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
