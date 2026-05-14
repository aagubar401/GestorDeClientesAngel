"use strict";
/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Customers", "email", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  });
  await queryInterface.changeColumn("Customers", "phone", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
    validate: {
      is: /^[0-9]{9}$/,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Customers", "email", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
  await queryInterface.changeColumn("Customers", "phone", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
    validate: {
      is: /^[0-9]{9}$/,
    },
  });
}
