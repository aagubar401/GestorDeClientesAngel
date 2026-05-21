import createUser from "../../controllers/auth/createUser.js";

jest.mock(
  "../../controllers/auth/data-access-layer/registerUserDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

jest.mock("../../utils/sendAudit.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

import registerUserDAL from "../../controllers/auth/data-access-layer/registerUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";
import jwt from "jsonwebtoken";

describe("Controller: createUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Test",
        email: "test@test.com",
        password: "123456",
        repeatPassword: "123456",
        role: "user",
      },
      headers: { authorization: "Bearer token" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
    jwt.sign.mockReturnValue("FAKE_TOKEN");
  });

  test("devuelve 201 si el usuario se crea correctamente", async () => {
    const mockUser = { id: 1, name: "Test", email: "test@test.com" };

    registerUserDAL.mockResolvedValue({ user: mockUser });

    await createUser(req, res);

    expect(registerUserDAL).toHaveBeenCalledWith({
      name: "Test",
      email: "test@test.com",
      password: "123456",
      repeatPassword: "123456",
      role: "user",
    });

    expect(sendAudit).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario creado correctamente",
      user: mockUser,
      token: "FAKE_TOKEN",
    });
  });

  test("devuelve 400 si el DAL devuelve error", async () => {
    registerUserDAL.mockResolvedValue({ error: "Error de prueba" });

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error de prueba" });
  });

  test("devuelve 500 si ocurre una excepción", async () => {
    registerUserDAL.mockRejectedValue(new Error("Boom"));

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al crear usuario",
    });
  });
});
