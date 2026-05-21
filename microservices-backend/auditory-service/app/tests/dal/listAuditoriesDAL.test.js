import listAuditoriesDAL from "../../controllers/data-access-layer/listAuditoriesDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    auditory: {
      findAll: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: listAuditoriesDAL", () => {
  test("devuelve el listado de auditorías correctamente", async () => {
    const mockAuditories = [
      { id: 1, action: "customer.modified" },
      { id: 2, action: "user.modified" },
    ];

    db.auditory.findAll.mockResolvedValue(mockAuditories);

    const result = await listAuditoriesDAL();

    expect(db.auditory.findAll).toHaveBeenCalledWith({
      order: [["createdAt", "DESC"]],
    });

    expect(result).toEqual({ auditories: mockAuditories });
  });

  test("devuelve error si Sequelize lanza excepción", async () => {
    db.auditory.findAll.mockRejectedValue(new Error("DB error"));

    const result = await listAuditoriesDAL();

    expect(result.error).toBe("DB error");
  });
});
