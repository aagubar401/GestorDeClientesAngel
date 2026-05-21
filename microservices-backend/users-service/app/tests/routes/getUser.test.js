import getUser from "../../controllers/users/getUser.js";

jest.mock("../../controllers/users/data-access-layer/getUserDAL.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import getUserDAL from "../../controllers/users/data-access-layer/getUserDAL.js";

describe("Controller: getUser", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 10 } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("devuelve 200 y el usuario si existe", async () => {
    const mockUser = { id: 10, name: "Test" };

    getUserDAL.mockResolvedValue({ user: mockUser });

    await getUser(req, res);

    expect(getUserDAL).toHaveBeenCalledWith({ id: 10 });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario encontrado",
      user: mockUser,
    });
  });

  test("devuelve 400 si ocurre un error en el DAL", async () => {
    getUserDAL.mockRejectedValue(new Error("Usuario no encontrado"));

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuario no encontrado",
    });
  });
});
