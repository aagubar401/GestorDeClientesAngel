import getUserByIdDAL from "../../controllers/users/data-access-layer/getUserByIdDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findByPk: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getUserByIdDAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("devuelve error si falta id", async () => {
    const result = await getUserByIdDAL(null);
    expect(result.error).toBe("Id no encontrado");
  });

  test("devuelve error si el usuario no existe", async () => {
    db.user.findByPk.mockResolvedValue(null);

    const result = await getUserByIdDAL(10);

    expect(db.user.findByPk).toHaveBeenCalledWith(10, {
      attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
    });

    expect(result.error).toBe("Usuario no encontrado");
  });

  test("devuelve el usuario si existe", async () => {
    const mockUser = {
      dataValues: { id: 10, name: "Test", email: "test@test.com" },
    };

    db.user.findByPk.mockResolvedValue(mockUser);

    const result = await getUserByIdDAL(10);

    expect(result).toEqual({ user: mockUser.dataValues });
  });
});
