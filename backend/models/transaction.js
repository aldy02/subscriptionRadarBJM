const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoice_number: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    package_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("subscription", "advertisement"), allowNull: false },
    total_price: { type: DataTypes.INTEGER, allowNull: false },
    payment_method: { type: DataTypes.STRING(50), allowNull: false },
    proof_payment: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM("pending", "accepted", "rejected"), defaultValue: "pending" },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "transactions",
    timestamps: false,
  }
);

Transaction.belongsTo(User, { foreignKey: "user_id" });

module.exports = Transaction;