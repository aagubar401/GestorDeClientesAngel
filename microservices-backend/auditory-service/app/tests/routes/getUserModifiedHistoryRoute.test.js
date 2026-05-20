import request from "supertest";
import app from "../../app.js";

// Mock del DAL para aislar la BD
jest.mock(
  "../../controllers/data-access-layer/getUserModifiedHistoryDAL.js",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

import getUserModifiedHistoryDAL from "../../controllers/data-access-layer/getUserModifiedHistoryDAL.js";

describe("GET /audit-logs/users/:userId/history", () => {
  test("devuelve historial correctamente", async () => {
    getUserModifiedHistoryDAL.mockResolvedValue([
      {
        id: 1,
        action: "user.modified",
        entityType: "user",
        entityId: 5,
        metadata: { oldUserName: "A", newUserName: "B" },
      },
    ]);

    const res = await request(app).get("/audit-logs/users/5/history");

    expect(res.status).toBe(200);
    expect(res.body.history.length).toBe(1);
    expect(res.body.history[0].metadata.newUserName).toBe("B");
  });

  test("devuelve error si DAL falla", async () => {
    getUserModifiedHistoryDAL.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/audit-logs/users/5/history");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("DB error");
  });
});
