import getCustomerModifiedHistoryDAL from "../../controllers/data-access-layer/getCustomerModifiedHistoryDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    auditory: {
      findAll: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getCustomerModifiedHistoryDAL", () => {
  test("devuelve auditorías filtradas correctamente", async () => {
    const mockLogs = [
      {
        id: 1,
        action: "customer.modified",
        entityType: "customer",
        entityId: 50,
        metadata: { oldName: "A", newName: "B" },
      },
    ];

    db.auditory.findAll.mockResolvedValue(mockLogs);

    const result = await getCustomerModifiedHistoryDAL(50);

    expect(db.auditory.findAll).toHaveBeenCalledWith({
      where: {
        action: "customer.modified",
        entityType: "customer",
        entityId: 50,
      },
      order: [["createdAt", "DESC"]],
    });

    expect(result).toEqual(mockLogs);
  });

  test("lanza error si falta customerId", async () => {
    await expect(getCustomerModifiedHistoryDAL(null)).rejects.toThrow(
      "Falta el ID del cliente",
    );
  });
});
