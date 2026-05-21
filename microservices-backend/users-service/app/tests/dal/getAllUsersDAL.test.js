import getAllUsersDAL from "../../controllers/users/data-access-layer/getAllUsersDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findAll: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getAllUsersDAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("devuelve listado de usuarios correctamente", async () => {
    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];

    db.user.findAll.mockResolvedValue(mockUsers);

    const result = await getAllUsersDAL();

    expect(db.user.findAll).toHaveBeenCalledWith({
      attributes: ["id", "name", "email", "role", "active", "avatar"],
    });

    expect(result).toEqual({ users: mockUsers });
  });

  test("devuelve error si Sequelize lanza excepción", async () => {
    db.user.findAll.mockRejectedValue(new Error("DB error"));

    const result = await getAllUsersDAL();

    expect(result.error).toBe("DB error");
  });
});
