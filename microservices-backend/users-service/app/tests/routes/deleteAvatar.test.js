import deleteAvatar from "../../controllers/users/deleteAvatar.js";

jest.mock(
  "../../controllers/users/data-access-layer/deleteAvatarDAL.js",
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

// Mock FS y PATH
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(() => "/fake/path/avatar.jpg"),
}));

import deleteAvatarDAL from "../../controllers/users/data-access-layer/deleteAvatarDAL.js";
import sendAudit from "../../utils/sendAudit.js";
import db from "../../models/db.js";
import fs from "fs";
import path from "path";

describe("Controller: deleteAvatar", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "10" },
      user: { id: 99, email: "actor@test.com" },
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
  });

  test("devuelve mensaje si el usuario no tiene avatar", async () => {
    db.user.findByPk.mockResolvedValue({ id: 10, avatar: null });

    await deleteAvatar(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "El usuario no tenía avatar",
    });
  });

  test("elimina avatar del FS y llama al DAL", async () => {
    db.user.findByPk.mockResolvedValue({
      id: 10,
      name: "Test",
      email: "test@test.com",
      avatar: "/public/usuarios/10/avatar.jpg",
    });

    fs.existsSync.mockReturnValue(true);

    await deleteAvatar(req, res);

    expect(path.join).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();

    expect(deleteAvatarDAL).toHaveBeenCalledWith({ id: "10" });
    expect(sendAudit).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: "Avatar eliminado correctamente",
    });
  });

  test("devuelve 500 si ocurre un error", async () => {
    db.user.findByPk.mockRejectedValue(new Error("Boom"));

    await deleteAvatar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error eliminando avatar",
    });
  });
});
