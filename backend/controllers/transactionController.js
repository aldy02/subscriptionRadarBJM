const { Transaction, SubscriptionPlan, Advertisement, AdvertisementContent, UserSubscription } = require("../models");
const { v4: uuidv4 } = require("uuid");

// Helper: generate invoice unik
const generateInvoice = () => {
  return "INV-" + Date.now() + "-" + uuidv4().slice(0, 6).toUpperCase();
};

// Create Transaction (Subscription / Advertisement)
exports.createTransaction = async (req, res) => {
  try {
    const { packageId, type, paymentMethod, content, duration } = req.body;

    if (!["subscription", "advertisement"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    // Cek harga paket
    let packageData;
    if (type === "subscription") {
      packageData = await SubscriptionPlan.findByPk(packageId);
    } else {
      packageData = await Advertisement.findByPk(packageId);
    }

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Simpan transaksi
    const transaction = await Transaction.create({
      invoice_number: generateInvoice(),
      user_id: req.user.id,
      package_id: packageId,
      type,
      total_price: packageData.price,
      payment_method: paymentMethod,
      proof_payment: req.file ? req.file.filename : null,
      status: "pending",
    });

    // Jika iklan → simpan konten
    if (type === "advertisement") {
      await AdvertisementContent.create({
        transaction_id: transaction.id,
        content,
        duration,
        banner: req.file ? req.file.filename : null,
      });
    }

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all transactions for current user
exports.getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: validate transaction
exports.validateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    // Jika subscription accepted → aktifkan user subscription
    if (transaction.type === "subscription" && status === "accepted") {
      const plan = await SubscriptionPlan.findByPk(transaction.package_id);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + plan.duration);

      await UserSubscription.create({
        user_id: transaction.user_id,
        subscription_plan_id: plan.id,
        start_date: startDate,
        end_date: endDate,
      });
    }

    // Jika advertisement accepted → update start & end date
    if (transaction.type === "advertisement" && status === "accepted") {
      const adContent = await AdvertisementContent.findOne({
        where: { transaction_id: transaction.id },
      });
      if (adContent) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + adContent.duration);

        adContent.start_date = startDate;
        adContent.end_date = endDate;
        await adContent.save();
      }
    }

    res.json({ message: "Transaction validated", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};