import loginUserDAL from "../../controllers/auth/data-access-layer/loginUserDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findOne: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// Mock JWT
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

import db from "../../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("DAL: loginUserDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lanza error si faltan campos", async () => {
    await expect(loginUserDAL({ email: "", password: "" })).rejects.toThrow(
      "Faltan campos obligatorios.",
    );
  });

  test("lanza error si el usuario no existe", async () => {
    db.user.findOne.mockResolvedValue(null);

    await expect(
      loginUserDAL({ email: "test@test.com", password: "1234" }),
    ).rejects.toThrow("Usuario no encontrado");
  });

  test("lanza error si la contraseña es incorrecta", async () => {
    db.user.findOne.mockResolvedValue({ passwordHash: "hash" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUserDAL({ email: "test@test.com", password: "1234" }),
    ).rejects.toThrow("Contraseña incorrecta");
  });

  test("devuelve usuario y token si todo es correcto", async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      role: "user",
      active: true,
      passwordHash: "hash",
      dataValues: { id: 1, email: "test@test.com", role: "user" },
      update: jest.fn(),
    };

    db.user.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("FAKE_TOKEN");

    const result = await loginUserDAL({
      email: "test@test.com",
      password: "1234",
    });

    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual({
      user: mockUser.dataValues,
      token: "FAKE_TOKEN",
    });
  });

  test("activa al usuario si estaba inactivo", async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      role: "user",
      active: false,
      passwordHash: "hash",
      dataValues: { id: 1, email: "test@test.com", role: "user" },
      update: jest.fn(),
    };

    db.user.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("TOKEN");

    await loginUserDAL({ email: "test@test.com", password: "1234" });

    expect(mockUser.update).toHaveBeenCalledWith({ active: true });
  });
});
