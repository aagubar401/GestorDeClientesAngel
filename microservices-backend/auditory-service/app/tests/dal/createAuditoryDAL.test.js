import createAuditoryDAL from "../../controllers/data-access-layer/createAuditoryDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    auditory: {
      create: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: createAuditoryDAL", () => {
  test("crea un registro de auditoría correctamente", async () => {
    const mockAuditory = { id: 1, action: "test.action" };

    db.auditory.create.mockResolvedValue(mockAuditory);

    const result = await createAuditoryDAL({
      userId: 5,
      userEmail: "test@test.com",
      action: "test.action",
      entityType: "customer",
      entityId: 123,
      serviceName: "customers-service",
      description: "Algo ha pasado",
      metadata: { foo: "bar" },
    });

    expect(db.auditory.create).toHaveBeenCalledWith({
      userId: 5,
      userEmail: "test@test.com",
      action: "test.action",
      entityType: "customer",
      entityId: 123,
      serviceName: "customers-service",
      description: "Algo ha pasado",
      metadata: { foo: "bar" },
    });

    expect(result).toEqual({ newAuditory: mockAuditory });
  });

  test("devuelve error si falta userId", async () => {
    const result = await createAuditoryDAL({
      userId: null,
      action: "test.action",
    });

    expect(result.error).toBe("El Id del usuario es obligatorio");
  });

  test("captura errores de Sequelize", async () => {
    db.auditory.create.mockRejectedValue(new Error("DB error"));

    const result = await createAuditoryDAL({
      userId: 5,
      action: "test.action",
    });

    expect(result.error).toBe("DB error");
  });
});
