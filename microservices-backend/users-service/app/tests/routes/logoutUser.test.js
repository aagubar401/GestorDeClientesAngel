import logoutUser from "../../controllers/auth/logoutUser.js";

jest.mock("../../controllers/auth/data-access-layer/logoutUserDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../utils/sendAudit.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findByPk: jest.fn(),
    },
  },
}));

import logoutUserDAL from "../../controllers/auth/data-access-layer/logoutUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";
import db from "../../models/db.js";

describe("Controller: logoutUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 10 },
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
  });

  test("devuelve 404 si el usuario no existe", async () => {
    db.user.findByPk.mockResolvedValue(null);

    await logoutUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuario no encontrado",
    });
  });

  test("devuelve 200 si el logout es correcto", async () => {
    const mockUser = {
      id: 10,
      name: "Test",
      email: "test@test.com",
      role: "user",
    };

    db.user.findByPk.mockResolvedValue(mockUser);
    logoutUserDAL.mockResolvedValue(true);

    await logoutUser(req, res);

    expect(logoutUserDAL).toHaveBeenCalledWith({ id: 10 });
    expect(sendAudit).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sesión cerrada correctamente",
    });
  });

  test("devuelve 400 si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    logoutUserDAL.mockRejectedValue(fakeError);

    db.user.findByPk.mockResolvedValue({ id: 10 });

    await logoutUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Boom",
    });
  });
});
