"use strict";
/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
}
