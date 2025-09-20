const { Transaction, Advertisement, AdvertisementContent, User } = require("../models");
const { uploadAdBanner } = require("../middleware/uploadMiddleware");

// Generate Invoice Number untuk Advertisement
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ADV${year}${month}${day}${random}`;
};

// Create Advertisement Transaction
// Create Advertisement Transaction
exports.createAdvertisementTransaction = async (req, res) => {
  try {
    const { 
      package_id, 
      content, 
      start_date, 
      duration, 
      total_price, // ← Get the calculated total price from frontend
      payment_method 
    } = req.body;
    const user_id = req.user.id;

    // Validasi input
    if (!package_id || !content || !start_date || !duration || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi"
      });
    }

    // Validasi total_price
    if (!total_price || parseInt(total_price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total price tidak valid"
      });
    }

    // Cek apakah ada file photo dan proof payment
    const photoFile = req.files?.photo?.[0];
    const proofFile = req.files?.proof_payment?.[0];

    if (!photoFile) {
      return res.status(400).json({
        success: false,
        message: "Foto iklan harus diupload"
      });
    }

    if (!proofFile) {
      return res.status(400).json({
        success: false,
        message: "Bukti pembayaran harus diupload"
      });
    }

    // Ambil data advertisement package untuk validasi
    const advertisementPackage = await Advertisement.findByPk(package_id);
    if (!advertisementPackage) {
      return res.status(404).json({
        success: false,
        message: "Paket iklan tidak ditemukan"
      });
    }

    // Optional: Validasi bahwa total_price sesuai dengan perhitungan
    const expectedTotal = advertisementPackage.price * parseInt(duration);
    if (parseInt(total_price) !== expectedTotal) {
      return res.status(400).json({
        success: false,
        message: `Total price tidak sesuai. Expected: ${expectedTotal}, Received: ${total_price}`
      });
    }

    // Hitung end date
    const startDate = new Date(start_date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(duration));

    // Generate invoice number
    const invoice_number = generateInvoiceNumber();

    // Create transaction dengan total_price dari frontend
    const transaction = await Transaction.create({
      invoice_number,
      user_id,
      package_id,
      type: "advertisement",
      total_price: parseInt(total_price),
      payment_method,
      proof_payment: proofFile.filename,
      status: "pending"
    });

    // Create advertisement content dengan status tidak aktif
    const advertisementContent = await AdvertisementContent.create({
      user_id,
      advertisement_id: package_id,
      transaction_id: transaction.id,
      content,
      photo: photoFile.filename,
      start_date: startDate,
      end_date: endDate,
      is_active: false // Tidak aktif sampai admin approve
    });

    res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat. Menunggu verifikasi admin.",
      data: {
        invoice_number: transaction.invoice_number,
        status: transaction.status,
        total_price: transaction.total_price,
        advertisement_content_id: advertisementContent.id
      }
    });

  } catch (error) {
    console.error("Create advertisement transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Get User Advertisement History
exports.getUserAdvertisements = async (req, res) => {
  try {
    const user_id = req.user.id;

    const advertisements = await AdvertisementContent.findAll({
      where: { user_id },
      include: [
        {
          model: Advertisement,
          attributes: ['id', 'name', 'size', 'price']
        },
        {
          model: Transaction,
          attributes: ['invoice_number', 'status', 'total_price', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error("Get user advertisements error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Get Active Advertisements (untuk ditampilkan di website)
exports.getActiveAdvertisements = async (req, res) => {
  try {
    const { size } = req.query;
    const currentDate = new Date();

    const whereClause = {
      is_active: true,
      start_date: { [require('sequelize').Op.lte]: currentDate },
      end_date: { [require('sequelize').Op.gte]: currentDate }
    };

    const advertisements = await AdvertisementContent.findAll({
      where: whereClause,
      include: [
        {
          model: Advertisement,
          attributes: ['name', 'size', 'price'],
          where: size ? { size } : undefined
        },
        {
          model: User,
          attributes: ['name']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: advertisements
    });

  } catch (error) {
    console.error("Get active advertisements error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// ===== ADMIN FUNCTIONS =====

// Get All Advertisement Contents (Admin)
exports.getAllAdvertisementContents = async (req, res) => {
  try {
    const { status, is_active, page = 1, limit = 10 } = req.query;

    const where = {};
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const include = [
      {
        model: User,
        attributes: ['id', 'name', 'email']
      },
      {
        model: Advertisement,
        attributes: ['id', 'name', 'size', 'price']
      },
      {
        model: Transaction,
        attributes: ['invoice_number', 'status', 'total_price', 'created_at']
      }
    ];

    // Filter berdasarkan status transaksi jika diminta
    if (status) {
      include[2].where = { status };
    }

    const offset = (page - 1) * limit;

    const { count, rows: advertisements } = await AdvertisementContent.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: advertisements,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get all advertisement contents error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

// Activate Advertisement Content (dipanggil otomatis saat transaksi diterima)
exports.activateAdvertisementContent = async (transaction_id) => {
  try {
    const advertisementContent = await AdvertisementContent.findOne({
      where: { transaction_id }
    });

    if (advertisementContent) {
      await advertisementContent.update({
        is_active: true
      });
    }

    return advertisementContent;
  } catch (error) {
    console.error("Activate advertisement content error:", error);
    throw error;
  }
};

// Deactivate Advertisement Content (dipanggil otomatis saat transaksi ditolak)
exports.deactivateAdvertisementContent = async (transaction_id) => {
  try {
    const advertisementContent = await AdvertisementContent.findOne({
      where: { transaction_id }
    });

    if (advertisementContent) {
      // Hapus atau set is_active ke false - sesuai kebutuhan
      await advertisementContent.destroy();
      // Atau jika ingin keep record:
      // await advertisementContent.update({ is_active: false });
    }

    return advertisementContent;
  } catch (error) {
    console.error("Deactivate advertisement content error:", error);
    throw error;
  }
};

// Get Advertisement Content by ID (Admin)
exports.getAdvertisementContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisementContent = await AdvertisementContent.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Advertisement,
          attributes: ['id', 'name', 'size', 'price']
        },
        {
          model: Transaction,
          attributes: ['invoice_number', 'status', 'total_price', 'payment_method', 'proof_payment', 'created_at']
        }
      ]
    });

    if (!advertisementContent) {
      return res.status(404).json({
        message: "Konten iklan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: advertisementContent
    });

  } catch (error) {
    console.error("Get advertisement content error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};

module.exports = {
  createAdvertisementTransaction: exports.createAdvertisementTransaction,
  getUserAdvertisements: exports.getUserAdvertisements,
  getActiveAdvertisements: exports.getActiveAdvertisements,
  getAllAdvertisementContents: exports.getAllAdvertisementContents,
  activateAdvertisementContent: exports.activateAdvertisementContent,
  deactivateAdvertisementContent: exports.deactivateAdvertisementContent,
  getAdvertisementContentById: exports.getAdvertisementContentById
};