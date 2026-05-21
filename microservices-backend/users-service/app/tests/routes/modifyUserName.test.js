import modifyUserName from "../../controllers/auth/modifyUserName.js";

jest.mock(
  "../../controllers/auth/data-access-layer/modifyUserNameDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

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

import modifyUserNameDAL from "../../controllers/auth/data-access-layer/modifyUserNameDAL.js";
import sendAudit from "../../utils/sendAudit.js";
import db from "../../models/db.js";

describe("Controller: modifyUserName", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 10 },
      body: { name: "Nuevo Nombre" },
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
  });

  test("devuelve 400 si el nombre está vacío", async () => {
    req.body.name = "   ";

    await modifyUserName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "El nombre no puede estar vacío",
    });
  });

  test("devuelve 404 si el usuario no existe", async () => {
    db.user.findByPk.mockResolvedValue(null);

    await modifyUserName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuario no encontrado",
    });
  });

  test("devuelve 200 si el nombre es el mismo", async () => {
    const mockUser = { id: 10, name: "Nuevo Nombre", email: "test@test.com" };

    db.user.findByPk.mockResolvedValue(mockUser);
    modifyUserNameDAL.mockResolvedValue({ user: mockUser });

    await modifyUserName(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "El nombre es el mismo que el actual",
      user: mockUser,
    });
  });

  test("devuelve 200 si el nombre se actualiza correctamente", async () => {
    const oldUser = { id: 10, name: "Viejo", email: "test@test.com" };
    const updatedUser = { id: 10, name: "Nuevo Nombre" };

    db.user.findByPk.mockResolvedValue(oldUser);
    modifyUserNameDAL.mockResolvedValue({ user: updatedUser });

    await modifyUserName(req, res);

    expect(modifyUserNameDAL).toHaveBeenCalledWith({
      userId: 10,
      name: "Nuevo Nombre",
    });

    expect(sendAudit).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Nombre actualizado correctamente",
      user: updatedUser,
    });
  });

  test("devuelve 400 si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    db.user.findByPk.mockRejectedValue(fakeError);

    await modifyUserName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Boom",
    });
  });
});
