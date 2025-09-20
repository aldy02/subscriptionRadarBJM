const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    subscription_plan_id: { type: DataTypes.INTEGER, allowNull: false },
    transaction_id: { type: DataTypes.INTEGER, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "user_subscriptions",
    timestamps: false,
  }
);

module.exports = UserSubscription;