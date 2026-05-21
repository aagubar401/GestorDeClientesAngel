import createAuditory from "../../controllers/createAuditory.js";

jest.mock("../../controllers/data-access-layer/createAuditoryDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import createAuditoryDAL from "../../controllers/data-access-layer/createAuditoryDAL.js";

describe("Controller: createAuditory", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        action: "test.action",
        entityType: "customer",
        entityId: 123,
        description: "desc",
        metadata: { foo: "bar" },
        serviceName: "customers-service",
        userIdSend: 5,
        userEmailSend: "test@test.com",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 201 si la auditoría se crea correctamente", async () => {
    createAuditoryDAL.mockResolvedValue({
      newAuditory: { id: 1 },
    });

    await createAuditory(req, res, next);

    expect(createAuditoryDAL).toHaveBeenCalledWith({
      userId: 5,
      userEmail: "test@test.com",
      action: "test.action",
      entityType: "customer",
      entityId: 123,
      serviceName: "customers-service",
      description: "desc",
      metadata: { foo: "bar" },
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registro de auditoria creado correctamente",
      auditory: { id: 1 },
    });
  });

  test("devuelve 400 si el DAL devuelve error", async () => {
    createAuditoryDAL.mockResolvedValue({
      error: "Error de prueba",
    });

    await createAuditory(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error de prueba" });
  });

  test("llama a next(error) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    createAuditoryDAL.mockRejectedValue(fakeError);

    await createAuditory(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
