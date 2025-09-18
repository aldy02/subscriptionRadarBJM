const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdvertisementContent = sequelize.define(
  "AdvertisementContent",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    advertisement_id: { type: DataTypes.INTEGER, allowNull: false },
    transaction_id: { type: DataTypes.INTEGER, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "advertisement_content",
    timestamps: false,
  }
);

module.exports = AdvertisementContent;