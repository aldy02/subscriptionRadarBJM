const { Transaction, SubscriptionPlan, User, UserSubscription, Advertisement, AdvertisementContent } = require("../models");
const { uploadPayment } = require("../middleware/uploadMiddleware");
const { activateAdvertisementContent, deactivateAdvertisementContent } = require("./advertisementContentController");

// Generate Invoice Number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV${year}${month}${day}${random}`;
};

// Create Transaction untuk Subscription
exports.createSubscriptionTransaction = async (req, res) => {
  try {
    const { package_id, payment_method } = req.body;
    const user_id = req.user.id;

    // Validasi input
    if (!package_id || !payment_method) {
      return res.status(400).json({
        message: "Package ID dan payment method harus diisi"
      });
    }

    // Cek apakah file proof payment ada
    if (!req.file) {
      return res.status(400).json({
        message: "Bukti pembayaran harus diupload"
      });
    }

    // 🔹 CHECK IF USER HAS ACTIVE SUBSCRIPTION
    const now = new Date();
    const activeSubscription = await UserSubscription.findOne({
      where: { 
        user_id: user_id,
        is_active: true 
      },
      order: [["end_date", "DESC"]],
    });

    if (activeSubscription) {
      const endDate = new Date(activeSubscription.end_date);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      
      // Double check if subscription is really active
      if (endDate > now) {
        return res.status(400).json({
          message: "Anda masih memiliki paket subscription aktif",
          hasActiveSubscription: true,
          activeSubscription: {
            id: activeSubscription.id,
            endDate: activeSubscription.end_date,
            daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
          }
        });
      } else {
        // If subscription is expired, deactivate it
        await activeSubscription.update({ is_active: false });
        console.log(`Deactivated expired subscription ID: ${activeSubscription.id}`);
      }
    }
    // 🔹 END OF ACTIVE SUBSCRIPTION CHECK

    // Ambil data subscription plan
    const subscriptionPlan = await SubscriptionPlan.findByPk(package_id);
    if (!subscriptionPlan) {
      return res.status(404).json({
        message: "Subscription plan tidak ditemukan"
      });
    }

    // Generate invoice number
    const invoice_number = generateInvoiceNumber();

    // Create transaction
    const transaction = await Transaction.create({
      invoice_number,
      user_id,
      package_id,
      type: "subscription",
      total_price: subscriptionPlan.price,
      payment_method,
      proof_payment: req.file.filename,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat. Menunggu verifikasi admin.",
      data: {
        invoice_number: transaction.invoice_number,
        status: transaction.status,
        total_price: transaction.total_price
      }
    });

  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Get Transaction History untuk User
exports.getUserTransactions = async (req, res) => {
  try {
    const user_id = req.user.id;

    const transactions = await Transaction.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: SubscriptionPlan,
          attributes: ["id", "name", "price", "duration"]
        },
        {
          model: UserSubscription,
          attributes: ["start_date", "end_date", "is_active"],
          required: false
        },
        {
          model: Advertisement,
          attributes: ["id", "name", "price", "size"],
          required: false
        },
        {
          model: AdvertisementContent,
          attributes: ["id", "start_date", "end_date", "is_active"],
          required: false,
          include: [
            {
              model: Advertisement,
              attributes: ["name"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error("Get user transactions error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Get Transaction by Invoice (untuk user)
exports.getTransactionByInvoice = async (req, res) => {
  try {
    const { invoice_number } = req.params;
    const user_id = req.user.id;

    const transaction = await Transaction.findOne({
      where: { invoice_number, user_id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: SubscriptionPlan,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// ===== ADMIN FUNCTIONS =====

// Get All Transactions (Admin only)
exports.getAllTransactions = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: SubscriptionPlan,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Update Transaction Status (Admin only) - Updated untuk handle advertisement
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    // Validasi status
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid"
      });
    }

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

    // Update transaction
    await transaction.update({
      status,
      admin_notes: admin_notes || null,
      updated_at: new Date()
    });

    // Handle berdasarkan type transaksi dan status
    if (status === 'accepted') {
      if (transaction.type === 'subscription') {
        // Create user subscription
        const { UserSubscription, SubscriptionPlan } = require("../models");
        const plan = await SubscriptionPlan.findByPk(transaction.package_id);
        if (plan) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(startDate.getDate() + plan.duration);

          await UserSubscription.create({
            user_id: transaction.user_id,
            subscription_plan_id: transaction.package_id,
            transaction_id: transaction.id,
            start_date: startDate,
            end_date: endDate,
            is_active: true
          });
        }
      } else if (transaction.type === 'advertisement') {
        // Activate advertisement content
        await activateAdvertisementContent(transaction.id);
      }
    } else if (status === 'rejected') {
      if (transaction.type === 'advertisement') {
        // Deactivate/delete advertisement content
        await deactivateAdvertisementContent(transaction.id);
      }
    }

    res.json({
      success: true,
      message: `Transaksi berhasil ${status}`,
      data: transaction
    });

  } catch (error) {
    console.error("Update transaction status error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Get Transaction Dashboard Stats (Admin)
exports.getTransactionStats = async (req, res) => {
  try {
    const { Op } = require('sequelize');

    // Total transactions by status
    const statusStats = await Transaction.findAll({
      attributes: [
        'status',
        [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count'],
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total_price')), 'total_amount']
      ],
      group: ['status'],
      raw: true
    });

    // Monthly revenue
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Transaction.findAll({
      attributes: [
        [Transaction.sequelize.fn('MONTH', Transaction.sequelize.col('created_at')), 'month'],
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total_price')), 'revenue']
      ],
      where: {
        status: 'accepted',
        created_at: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
          [Op.lte]: new Date(`${currentYear}-12-31`)
        }
      },
      group: [Transaction.sequelize.fn('MONTH', Transaction.sequelize.col('created_at'))],
      raw: true
    });

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        statusStats,
        monthlyRevenue,
        recentTransactions
      }
    });

  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};