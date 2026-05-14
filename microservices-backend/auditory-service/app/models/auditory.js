"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Auditory extends Model {
    static associate(models) {
      // asociaciones si las necesitas
    }
  }

  Auditory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Auditory",
      tableName: "Auditory", // 🔥 nombre EXACTO de la tabla
      freezeTableName: true, // 🔥 evita pluralización
      timestamps: true,
    },
  );

  return Auditory;
};
