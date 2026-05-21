import getCustomerModifiedHistory from "../../controllers/getCustomerModifiedHistory.js";

jest.mock(
  "../../controllers/data-access-layer/getCustomerModifiedHistoryDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

import getCustomerModifiedHistoryDAL from "../../controllers/data-access-layer/getCustomerModifiedHistoryDAL.js";

describe("Controller: getCustomerModifiedHistory", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { customerId: 50 } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("devuelve 200 y el historial correctamente", async () => {
    const mockHistory = [{ id: 1, action: "customer.modified", entityId: 50 }];

    getCustomerModifiedHistoryDAL.mockResolvedValue(mockHistory);

    await getCustomerModifiedHistory(req, res);

    expect(getCustomerModifiedHistoryDAL).toHaveBeenCalledWith(50);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Historial de modificaciones obtenido correctamente",
      history: mockHistory,
    });
  });

  test("devuelve 500 si el DAL lanza error", async () => {
    getCustomerModifiedHistoryDAL.mockRejectedValue(new Error("DB error"));

    await getCustomerModifiedHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "DB error",
    });
  });
});
