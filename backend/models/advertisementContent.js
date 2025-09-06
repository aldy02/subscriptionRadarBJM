const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Transaction = require("./transaction");

const AdvertisementContent = sequelize.define(
  "AdvertisementContent",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transaction_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false }, // hari
    banner: { type: DataTypes.STRING(255), allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "advertisement_contents",
    timestamps: false,
  }
);

AdvertisementContent.belongsTo(Transaction, { foreignKey: "transaction_id" });

module.exports = AdvertisementContent;