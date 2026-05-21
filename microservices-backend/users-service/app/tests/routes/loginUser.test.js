import loginUser from "../../controllers/auth/loginUser.js";

jest.mock("../../controllers/auth/data-access-layer/loginUserDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../utils/sendAudit.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import loginUserDAL from "../../controllers/auth/data-access-layer/loginUserDAL.js";
import sendAudit from "../../utils/sendAudit.js";

describe("Controller: loginUser", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: "test@test.com", password: "1234" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sendAudit.mockResolvedValue();
  });

  test("devuelve 200 si el login es correcto", async () => {
    const mockUser = {
      id: 1,
      name: "Test",
      email: "test@test.com",
      role: "user",
    };

    loginUserDAL.mockResolvedValue({
      user: mockUser,
      token: "FAKE_TOKEN",
    });

    await loginUser(req, res);

    expect(loginUserDAL).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "1234",
    });

    expect(sendAudit).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Inicio de sesión correcto",
      user: mockUser,
      token: "FAKE_TOKEN",
    });
  });

  test("devuelve 400 si el DAL lanza error", async () => {
    loginUserDAL.mockRejectedValue(new Error("Usuario no encontrado"));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuario no encontrado",
    });
  });
});
