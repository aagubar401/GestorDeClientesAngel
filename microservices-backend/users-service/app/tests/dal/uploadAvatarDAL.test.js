import uploadAvatarDAL from "../../controllers/users/data-access-layer/uploadAvatarDAL.js";

// Mock del modelo Sequelize
jest.mock("../../models/db.js", () => ({
  default: {
    user: {
      update: jest.fn(),
    },
  },
}));

import db from "../../models/db.js";

describe("DAL: uploadAvatarDAL", () => {
  beforeEach(() => jest.clearAllMocks());

  test("actualiza avatar correctamente", async () => {
    db.user.update.mockResolvedValue([1]);

    const result = await uploadAvatarDAL({
      id: 10,
      avatarPath: "/public/usuarios/10/avatar.jpg",
    });

    expect(db.user.update).toHaveBeenCalledWith(
      { avatar: "/public/usuarios/10/avatar.jpg" },
      { where: { id: 10 } },
    );

    expect(result).toEqual([1]);
  });
});
