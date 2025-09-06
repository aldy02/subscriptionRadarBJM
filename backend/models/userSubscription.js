const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const SubscriptionPlan = require("./subscriptionPlan");

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    subscription_plan_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "user_subscriptions",
    timestamps: false,
  }
);

// Relasi
UserSubscription.belongsTo(User, { foreignKey: "user_id" });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: "subscription_plan_id" });

module.exports = UserSubscription;
