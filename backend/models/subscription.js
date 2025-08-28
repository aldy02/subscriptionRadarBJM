const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const SubscriptionPlan = require("./subscriptionPlan");

const Subscription = sequelize.define("Subscription", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  subscription_id: { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM("active", "expired", "pending"),
    defaultValue: "pending"
  },
}, {
  tableName: "subscriptions",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

// Table Relation
User.hasMany(Subscription, { foreignKey: "user_id" });
Subscription.belongsTo(User, { foreignKey: "user_id" });

SubscriptionPlan.hasMany(Subscription, { foreignKey: "subscription_id" });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: "subscription_id" });

module.exports = Subscription;
