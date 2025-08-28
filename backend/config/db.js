const { Sequelize } = require("sequelize");
require("dotenv").config();

// Koneksi MySQL to Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Cek connection
sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error: " + err));

module.exports = sequelize;