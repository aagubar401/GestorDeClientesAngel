import modifyUserNameDAL from "../../controllers/auth/data-access-layer/modifyUserNameDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findOne: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: modifyUserNameDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devuelve error si falta userId", async () => {
    const result = await modifyUserNameDAL({ userId: null, name: "Nuevo" });
    expect(result.error).toBe("Usuario no proporcionado");
  });

  test("devuelve error si el usuario no existe", async () => {
    db.user.findOne.mockResolvedValue(null);

    const result = await modifyUserNameDAL({ userId: 10, name: "Nuevo" });

    expect(db.user.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(result.error).toBe("Usuario no encontrado");
  });

  test("actualiza el nombre correctamente", async () => {
    const mockUser = {
      id: 10,
      dataValues: { id: 10, name: "Nuevo" },
      update: jest.fn(),
    };

    db.user.findOne.mockResolvedValue(mockUser);

    const result = await modifyUserNameDAL({ userId: 10, name: "Nuevo" });

    expect(mockUser.update).toHaveBeenCalled();
    expect(result).toEqual({ user: mockUser.dataValues });
  });
});
