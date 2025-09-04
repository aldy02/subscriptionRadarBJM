const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const News = sequelize.define("News", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      "Keuangan",
      "Bisnis",
      "Politik",
      "Gaya Hidup",
      "Teknologi",
      "Makanan & Minuman",
      "Hiburan",
      "Olahraga"
    ),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT("long"), 
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  tableName: "news",
});

module.exports = News;
