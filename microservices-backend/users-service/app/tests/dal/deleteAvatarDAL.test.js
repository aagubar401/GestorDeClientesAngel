import deleteAvatarDAL from "../../controllers/users/data-access-layer/deleteAvatarDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      update: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: deleteAvatarDAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("actualiza avatar a null correctamente", async () => {
    db.user.update.mockResolvedValue([1]);

    const result = await deleteAvatarDAL({ id: 10 });

    expect(db.user.update).toHaveBeenCalledWith(
      { avatar: null },
      { where: { id: 10 } },
    );

    expect(result).toEqual([1]);
  });
});
