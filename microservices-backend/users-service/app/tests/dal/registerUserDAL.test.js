import registerUserDAL from "../../controllers/auth/data-access-layer/registerUserDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

import db from "../../models/db.js";
import bcrypt from "bcrypt";

describe("DAL: registerUserDAL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lanza error si faltan campos obligatorios", async () => {
    await expect(
      registerUserDAL({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
      }),
    ).rejects.toThrow("Faltan campos obligatorios.");
  });

  test("lanza error si la contraseña es demasiado corta", async () => {
    await expect(
      registerUserDAL({
        name: "Test",
        email: "test@test.com",
        password: "123",
        repeatPassword: "123",
      }),
    ).rejects.toThrow("La contraseña debe tener mínimo 6 caracteres");
  });

  test("lanza error si las contraseñas no coinciden", async () => {
    await expect(
      registerUserDAL({
        name: "Test",
        email: "test@test.com",
        password: "123456",
        repeatPassword: "654321",
      }),
    ).rejects.toThrow("Las contraseñas no coinciden");
  });

  test("lanza error si el email ya está registrado", async () => {
    db.user.findOne.mockResolvedValue({ id: 1 });

    await expect(
      registerUserDAL({
        name: "Test",
        email: "test@test.com",
        password: "123456",
        repeatPassword: "123456",
      }),
    ).rejects.toThrow("El email ya está registrado");
  });

  test("crea un usuario correctamente", async () => {
    db.user.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("HASHED_PASSWORD");

    const mockUser = {
      dataValues: { id: 1, name: "Test", email: "test@test.com" },
    };

    db.user.create.mockResolvedValue(mockUser);

    const result = await registerUserDAL({
      name: "Test",
      email: "test@test.com",
      password: "123456",
      repeatPassword: "123456",
      role: "user",
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(db.user.create).toHaveBeenCalled();

    expect(result).toEqual({ user: mockUser.dataValues });
  });
});
