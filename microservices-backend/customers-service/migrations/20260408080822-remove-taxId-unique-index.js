"use strict";

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  // 1. Eliminar índice único si existe
  await queryInterface.removeIndex("Customers", ["taxId"]).catch(() => {});

  // 2. Asegurar que la columna no tiene unique
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  });
}

export async function down(queryInterface, Sequelize) {
  // 1. Restaurar índice único
  await queryInterface.addIndex("Customers", ["taxId"], {
    unique: true,
    name: "customers_taxid_unique",
  });

  // 2. Restaurar unique en la columna
  await queryInterface.changeColumn("Customers", "taxId", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  });
}
