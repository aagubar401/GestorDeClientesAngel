import getUserDAL from "../../controllers/users/data-access-layer/getUserDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findByPk: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: getUserDAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("lanza error si falta id", async () => {
    await expect(getUserDAL({ id: null })).rejects.toThrow(
      "ID de usuario es requerido",
    );
  });

  test("lanza error si el usuario no existe", async () => {
    db.user.findByPk.mockResolvedValue(null);

    await expect(getUserDAL({ id: 10 })).rejects.toThrow(
      "Usuario no encontrado",
    );

    expect(db.user.findByPk).toHaveBeenCalledWith(10, {
      attributes: { exclude: ["passwordHash", "createdAt", "updatedAt"] },
    });
  });

  test("devuelve el usuario si existe", async () => {
    const mockUser = {
      dataValues: { id: 10, name: "Test", email: "test@test.com" },
    };

    db.user.findByPk.mockResolvedValue(mockUser);

    const result = await getUserDAL({ id: 10 });

    expect(result).toEqual({ user: mockUser.dataValues });
  });
});
