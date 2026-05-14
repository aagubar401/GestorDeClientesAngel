"use strict";
/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // taxId → permitir NULL
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  // email → permitir NULL
  await queryInterface.changeColumn("Customers", "email", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });

  // phone → permitir NULL
  await queryInterface.changeColumn("Customers", "phone", {
    type: Sequelize.STRING(9),
    allowNull: true,
    unique: true,
  });

  // address → permitir NULL
  await queryInterface.changeColumn("Customers", "address", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  // taxId → volver a NOT NULL
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  // email → volver a NOT NULL
  await queryInterface.changeColumn("Customers", "email", {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  });

  // phone → volver a NOT NULL
  await queryInterface.changeColumn("Customers", "phone", {
    type: Sequelize.STRING(9),
    allowNull: false,
    unique: true,
  });

  // address → volver a NOT NULL
  await queryInterface.changeColumn("Customers", "address", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}
