const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: true },
  profile_photo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "default.jpg"
  },
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    defaultValue: "customer"
  }
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"   
});

module.exports = User;
