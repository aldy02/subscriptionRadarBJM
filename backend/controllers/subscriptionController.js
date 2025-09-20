const UserSubscription = require("../models/userSubscription");
const SubscriptionPlan = require("../models/subscriptionPlan");

// Customer pilih paket langganan
exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    // Cari plan
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ message: "Paket tidak ditemukan" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    // Simpan ke user_subscriptions
    const subscription = await UserSubscription.create({
      user_id: req.user.id,
      plan_id: plan.id,
      start_date: startDate,
      end_date: endDate,
      status: "active",
    });

    res.status(201).json({
      message: "Langganan berhasil dibuat",
      subscription,
    });
  } catch (error) {
    console.error("Create subscription error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Customer lihat langganan mereka
exports.getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.findAll({
      where: { user_id: req.user.id },
      include: [SubscriptionPlan],
    });

    res.json(subscriptions);
  } catch (error) {
    console.error("Get my subscriptions error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Admin lihat semua langganan
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.findAll({
      include: [SubscriptionPlan],
    });

    res.json(subscriptions);
  } catch (error) {
    console.error("Get all subscriptions error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};