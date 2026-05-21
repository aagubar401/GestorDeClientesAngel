import consultCustomer from "../../controllers/consultCustomer.js";

jest.mock("../../controllers/data-access-layer/consultCustomerDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import consultCustomerDAL from "../../controllers/data-access-layer/consultCustomerDAL.js";

describe("Controller: consultCustomer", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: 10 },
      userId: 5,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 200 y el cliente si existe", async () => {
    const mockCustomer = { id: 10, name: "Cliente Test" };

    consultCustomerDAL.mockResolvedValue({ customer: mockCustomer });

    await consultCustomer(req, res, next);

    expect(consultCustomerDAL).toHaveBeenCalledWith({ id: 10, userId: 5 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ customer: mockCustomer });
  });

  test("devuelve 404 si el DAL devuelve error", async () => {
    consultCustomerDAL.mockResolvedValue({
      error: "Cliente no encontrado o no pertenece al usuario",
    });

    await consultCustomer(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Cliente no encontrado o no pertenece al usuario",
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    consultCustomerDAL.mockRejectedValue(fakeError);

    await consultCustomer(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
