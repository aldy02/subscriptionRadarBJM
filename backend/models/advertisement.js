const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Advertisement = sequelize.define(
  "Advertisement",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    size: { type: DataTypes.STRING(50), allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "advertisement",
    timestamps: false,
  }
);

module.exports = Advertisement;