import listCustomers from "../../controllers/listCustomers.js";

jest.mock("../../controllers/data-access-layer/listCustomersDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import listCustomersDAL from "../../controllers/data-access-layer/listCustomersDAL.js";

describe("Controller: listCustomers", () => {
  let req, res, next;

  beforeEach(() => {
    req = { userId: 5 };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 200 y el listado de clientes", async () => {
    const mockCustomers = [
      { id: 1, name: "Cliente 1" },
      { id: 2, name: "Cliente 2" },
    ];

    listCustomersDAL.mockResolvedValue({ customers: mockCustomers });

    await listCustomers(req, res, next);

    expect(listCustomersDAL).toHaveBeenCalledWith({ userId: 5 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Listado filtrado correctamente",
      customers: mockCustomers,
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    listCustomersDAL.mockRejectedValue(fakeError);

    await listCustomers(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
