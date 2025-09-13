const Transaction = require("./transaction");
const SubscriptionPlan = require("./subscriptionPlan");
const Advertisement = require("./advertisement");
const UserSubscription = require("./userSubscription");
const User = require("./user");
const News = require("./news");

// Relasi
UserSubscription.belongsTo(User, { foreignKey: "user_id" });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: "subscription_plan_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  Transaction,
  SubscriptionPlan,
  Advertisement,
  UserSubscription,
  User,
  News,
};