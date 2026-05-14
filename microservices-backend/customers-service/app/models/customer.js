"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      /*
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts'
      });*/
    }
  }
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taxId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(9),
        allowNull: true,
        unique: false,
        validate: {
          is: /^[0-9]{9}$/,
        },
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Customer",
    },
  );

  return Customer;
};
