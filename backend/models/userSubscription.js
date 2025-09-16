const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    subscription_plan_id: { type: DataTypes.INTEGER, allowNull: false },

    // ✅ Tambahkan kolom transaction_id
    transaction_id: { type: DataTypes.INTEGER, allowNull: true },

    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "user_subscriptions",
    timestamps: false,
  }
);

module.exports = UserSubscription;