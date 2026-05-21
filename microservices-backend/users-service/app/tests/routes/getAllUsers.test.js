import getAllUsers from "../../controllers/users/getAllUsers.js";

jest.mock(
  "../../controllers/users/data-access-layer/getAllUsersDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

import getAllUsersDAL from "../../controllers/users/data-access-layer/getAllUsersDAL.js";

describe("Controller: getAllUsers", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test("devuelve 200 y el listado de usuarios", async () => {
    const mockUsers = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];

    getAllUsersDAL.mockResolvedValue({ users: mockUsers });

    await getAllUsers(req, res, next);

    expect(getAllUsersDAL).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
  });

  test("devuelve 500 si el DAL devuelve error", async () => {
    getAllUsersDAL.mockResolvedValue({ error: "Error de prueba" });

    await getAllUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error de prueba" });
  });

  test("llama a next(err) si ocurre una excepción", async () => {
    const fakeError = new Error("Boom");
    getAllUsersDAL.mockRejectedValue(fakeError);

    await getAllUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(fakeError);
  });
});
