const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes")
const newsRoutes = require("./routes/newsRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes"); 

dotenv.config();
const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscription-plans", subscriptionPlanRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Database connection error: " + err));

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
