const { UserSubscription } = require("../models");

// Middleware untuk mengecek subscription aktif
exports.checkActiveSubscription = async (req, res, next) => {
  try {
    // Hanya check untuk customer
    if (req.user.role !== "customer") {
      return next();
    }

    const now = new Date();
    const subscription = await UserSubscription.findOne({
      where: { 
        user_id: req.user.id,
        is_active: true 
      },
      order: [["end_date", "DESC"]],
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: "Subscription diperlukan untuk mengakses konten ini",
        requiresSubscription: true 
      });
    }

    // Check if subscription is expired
    if (new Date(subscription.end_date) < now) {
      // Deactivate expired subscription
      await subscription.update({ is_active: false });
      
      return res.status(403).json({ 
        message: "Subscription Anda telah berakhir. Silakan perpanjang untuk mengakses konten.",
        subscriptionExpired: true 
      });
    }

    // Add subscription info to request
    req.subscription = subscription;
    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengecek subscription" });
  }
};

// Middleware untuk konten premium (opsional - jika ada tier subscription)
exports.checkPremiumSubscription = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return next();
    }

    // Asumsi ada kolom subscription_type di tabel subscription_plans
    const subscription = await UserSubscription.findOne({
      where: { 
        user_id: req.user.id,
        is_active: true 
      },
      include: [{
        model: require("../models/subscription_plans"), // Adjust sesuai model Anda
        attributes: ["type", "name"]
      }],
      order: [["end_date", "DESC"]],
    });

    if (!subscription) {
      return res.status(403).json({ 
        message: "Premium subscription diperlukan untuk mengakses konten ini",
        requiresPremium: true 
      });
    }

    // Check if it's premium subscription (adjust logic sesuai kebutuhan)
    if (subscription.SubscriptionPlan.type !== "premium") {
      return res.status(403).json({ 
        message: "Upgrade ke premium subscription untuk mengakses konten ini",
        requiresPremium: true 
      });
    }

    next();
  } catch (error) {
    console.error("Premium subscription check error:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat mengecek premium subscription" });
  }
};