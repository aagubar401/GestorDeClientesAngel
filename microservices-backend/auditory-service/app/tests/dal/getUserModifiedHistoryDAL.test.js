import getUserModifiedHistoryDAL from "../../controllers/data-access-layer/getUserModifiedHistoryDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    auditory: {
      findAll: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getUserModifiedHistoryDAL", () => {
  test("devuelve auditorías filtradas correctamente", async () => {
    db.auditory.findAll.mockResolvedValue([
      {
        id: 1,
        action: "user.modified",
        entityType: "user",
        entityId: 5,
        metadata: { oldUserName: "A", newUserName: "B" },
      },
    ]);

    const result = await getUserModifiedHistoryDAL(5);

    expect(db.auditory.findAll).toHaveBeenCalledWith({
      where: {
        action: "user.modified",
        entityType: "user",
        entityId: 5,
      },
      order: [["createdAt", "DESC"]],
    });

    expect(result.length).toBe(1);
    expect(result[0].metadata.newUserName).toBe("B");
  });

  test("lanza error si falta userId", async () => {
    await expect(getUserModifiedHistoryDAL(null)).rejects.toThrow(
      "Falta el ID del usuario",
    );
  });
});
