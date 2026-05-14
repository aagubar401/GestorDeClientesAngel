"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Customers", "userId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Customers", "userId");
}
