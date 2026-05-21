import uploadAvatar from "../../controllers/users/uploadAvatar.js";

// Mock del DAL
jest.mock(
  "../../controllers/users/data-access-layer/uploadAvatarDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

// Mock sendAudit
jest.mock("../../utils/sendAudit.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock DB
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findByPk: jest.fn(),
    },
  },
}));

// Mock FS y PATH
jest.mock("fs", () => ({
  mkdirSync: jest.fn(),
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(() => "/fake/path/avatar.jpg"),
}));

// Mock multer: sustituimos .single() por una función que llama directamente al callback
jest.mock("multer", () => {
  return () => ({
    single: () => (req, res, cb) => cb(null),
  });
});

import uploadAvatarDAL from "../../controllers/users/data-access-layer/uploadAvatarDAL.js";
import sendAudit from "../../utils/sendAudit.js";
import db from "../../models/db.js";

describe("Controller: uploadAvatar", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "10" },
      user: { id: 99, email: "actor@test.com" },
      headers: { authorization: "Bearer token" },
      file: {
        filename: "avatar.jpg",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
  });

  test("devuelve 400 si multer devuelve error", async () => {
    // Re-mock multer para simular error
    jest.doMock("multer", () => {
      return () => ({
        single: () => (req, res, cb) => cb(new Error("multer error")),
      });
    });

    const uploadAvatarWithError = (
      await import("../../controllers/users/uploadAvatar.js")
    ).default;

    await uploadAvatarWithError(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error subiendo archivo",
    });
  });

  test("devuelve 400 si no se envía archivo", async () => {
    req.file = null;

    await uploadAvatar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "No se envió ninguna imagen",
    });
  });

  test("sube avatar correctamente y envía auditoría", async () => {
    const mockUser = {
      id: 10,
      name: "Test",
      email: "test@test.com",
    };

    db.user.findByPk.mockResolvedValue(mockUser);
    uploadAvatarDAL.mockResolvedValue([1]);

    await uploadAvatar(req, res);

    expect(uploadAvatarDAL).toHaveBeenCalledWith({
      id: "10",
      avatarPath: "/public/usuarios/10/avatar.jpg",
    });

    expect(sendAudit).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith({
      message: "Avatar actualizado correctamente",
      avatar: "/public/usuarios/10/avatar.jpg",
    });
  });

  test("devuelve 500 si ocurre un error interno", async () => {
    db.user.findByPk.mockRejectedValue(new Error("Boom"));

    await uploadAvatar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error interno al subir avatar",
    });
  });
});
