import getAuditoryById from "../../controllers/getAuditoryById.js";

jest.mock("../../controllers/data-access-layer/getAuditoryByIdDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import getAuditoryByIdDAL from "../../controllers/data-access-layer/getAuditoryByIdDAL.js";

describe("Controller: getAuditoryById", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: 10 } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 200 si el registro existe", async () => {
    getAuditoryByIdDAL.mockResolvedValue({
      auditory: { id: 10, action: "test.action" },
    });

    await getAuditoryById(req, res, next);

    expect(getAuditoryByIdDAL).toHaveBeenCalledWith(10);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Detalle de auditoría obtenido correctamente",
      auditory: { id: 10, action: "test.action" },
    });
  });

  test("devuelve 404 si DAL devuelve error", async () => {
    getAuditoryByIdDAL.mockResolvedValue({
      error: "Registro de auditoría no encontrado",
    });

    await getAuditoryById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Registro de auditoría no encontrado",
    });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    getAuditoryByIdDAL.mockRejectedValue(fakeError);

    await getAuditoryById(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
