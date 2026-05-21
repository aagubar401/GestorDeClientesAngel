import getUserById from "../../controllers/users/getUserById.js";

jest.mock(
  "../../controllers/users/data-access-layer/getUserByIdDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

import getUserByIdDAL from "../../controllers/users/data-access-layer/getUserByIdDAL.js";

describe("Controller: getUserById", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "10" } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("devuelve 404 si el DAL devuelve error", async () => {
    getUserByIdDAL.mockResolvedValue({ error: "Usuario no encontrado" });

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Usuario no encontrado",
    });
  });

  test("devuelve 200 si el usuario existe", async () => {
    const mockUser = { id: 10, name: "Test" };

    getUserByIdDAL.mockResolvedValue({ user: mockUser });

    await getUserById(req, res);

    expect(getUserByIdDAL).toHaveBeenCalledWith("10");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("devuelve 500 si ocurre una excepción", async () => {
    getUserByIdDAL.mockRejectedValue(new Error("Boom"));

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error interno del servidor",
    });
  });
});
