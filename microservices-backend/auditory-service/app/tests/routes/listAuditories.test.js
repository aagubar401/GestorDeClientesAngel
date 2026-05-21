import listAuditories from "../../controllers/listAuditories.js";

jest.mock("../../controllers/data-access-layer/listAuditoriesDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import listAuditoriesDAL from "../../controllers/data-access-layer/listAuditoriesDAL.js";

describe("Controller: listAuditories", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 200 y el listado correctamente", async () => {
    const mockAuditories = [
      { id: 1, action: "customer.modified" },
      { id: 2, action: "user.modified" },
    ];

    listAuditoriesDAL.mockResolvedValue({ auditories: mockAuditories });

    await listAuditories(req, res, next);

    expect(listAuditoriesDAL).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Listado de auditorías obtenido correctamente",
      auditories: mockAuditories,
    });
  });

  test("devuelve 400 si el DAL devuelve error", async () => {
    listAuditoriesDAL.mockResolvedValue({ error: "Error de prueba" });

    await listAuditories(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error de prueba" });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    listAuditoriesDAL.mockRejectedValue(fakeError);

    await listAuditories(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
