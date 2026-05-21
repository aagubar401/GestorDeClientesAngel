import logoutUserDAL from "../../controllers/auth/data-access-layer/logoutUserDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findByPk: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: logoutUserDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lanza error si falta id", async () => {
    await expect(logoutUserDAL({ id: null })).rejects.toThrow(
      "ID de usuario es requerido",
    );
  });

  test("lanza error si el usuario no existe", async () => {
    db.user.findByPk.mockResolvedValue(null);

    await expect(logoutUserDAL({ id: 10 })).rejects.toThrow(
      "Usuario no encontrado",
    );
  });

  test("desactiva al usuario correctamente", async () => {
    const mockUser = {
      id: 10,
      update: jest.fn(),
    };

    db.user.findByPk.mockResolvedValue(mockUser);

    const result = await logoutUserDAL({ id: 10 });

    expect(mockUser.update).toHaveBeenCalledWith({ active: false });
    expect(result).toBe(true);
  });
});
