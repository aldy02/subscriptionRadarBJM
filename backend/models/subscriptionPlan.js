const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "subscription_plans",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

module.exports = SubscriptionPlan;