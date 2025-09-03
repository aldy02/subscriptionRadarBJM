import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
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

export default SubscriptionPlan;