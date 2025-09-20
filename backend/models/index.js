const Transaction = require("./transaction");
const SubscriptionPlan = require("./subscriptionPlan");
const Advertisement = require("./advertisement");
const AdvertisementContent = require("./advertisementContent")
const UserSubscription = require("./userSubscription");
const User = require("./user");
const News = require("./news");

// Relasi User
User.hasMany(Transaction, { foreignKey: "user_id" });
User.hasMany(UserSubscription, { foreignKey: "user_id" });
User.hasMany(AdvertisementContent, { foreignKey: "user_id" });

// Relasi UserSubscription
UserSubscription.belongsTo(User, { foreignKey: "user_id" });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: "subscription_plan_id" });
UserSubscription.belongsTo(Transaction, { foreignKey: "transaction_id" });

// Relasi Transaction
Transaction.belongsTo(User, { foreignKey: "user_id" });

// Relasi ke dua tabel berbeda melalui package_id
Transaction.belongsTo(SubscriptionPlan, { foreignKey: "package_id" });
Transaction.belongsTo(Advertisement, { foreignKey: "package_id" });

Transaction.hasOne(UserSubscription, { foreignKey: "transaction_id" });
Transaction.hasOne(AdvertisementContent, { foreignKey: "transaction_id" });

// Relasi AdvertisementContent
AdvertisementContent.belongsTo(User, { foreignKey: "user_id" });
AdvertisementContent.belongsTo(Advertisement, { foreignKey: "advertisement_id" });
AdvertisementContent.belongsTo(Transaction, { foreignKey: "transaction_id" });

// Relasi Advertisement
Advertisement.hasMany(AdvertisementContent, { foreignKey: "advertisement_id" });

module.exports = {
  Transaction,
  SubscriptionPlan,
  Advertisement,
  AdvertisementContent,
  UserSubscription,
  User,
  News,
};