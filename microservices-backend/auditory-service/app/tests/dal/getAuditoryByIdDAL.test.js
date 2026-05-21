import getAuditoryByIdDAL from "../../controllers/data-access-layer/getAuditoryByIdDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    auditory: {
      findOne: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getAuditoryByIdDAL", () => {
  test("devuelve un registro si existe", async () => {
    const mockAuditory = { id: 10, action: "test.action" };

    db.auditory.findOne.mockResolvedValue(mockAuditory);

    const result = await getAuditoryByIdDAL(10);

    expect(db.auditory.findOne).toHaveBeenCalledWith({
      where: { id: 10 },
    });

    expect(result).toEqual({ auditory: mockAuditory });
  });

  test("devuelve error si no existe el registro", async () => {
    db.auditory.findOne.mockResolvedValue(null);

    const result = await getAuditoryByIdDAL(99);

    expect(result.error).toBe("Registro de auditoría no encontrado");
  });

  test("captura errores de Sequelize", async () => {
    db.auditory.findOne.mockRejectedValue(new Error("DB error"));

    const result = await getAuditoryByIdDAL(10);

    expect(result.error).toBe("DB error");
  });
});
