const Advertisement = require("../models/advertisement");
const { Op } = require("sequelize");

// Get all advertisements
const getAdvertisements = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { size: { [Op.like]: `%${search}%` } }
      ];
    }

    const advertisements = await Advertisement.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]]
    });

    res.status(200).json({
      success: true,
      data: advertisements,
      message: "Data iklan berhasil diambil"
    });
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data iklan",
      error: error.message
    });
  }
};

// Create new advertisement
const createAdvertisement = async (req, res) => {
  try {
    const { name, size, price } = req.body;

    // Check for undefined, null, and empty string
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Nama iklan wajib diisi"
      });
    }

    if (!size || size.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Ukuran wajib diisi"
      });
    }

    // Price validation - check if price exists and is valid number
    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        success: false,
        message: "Harga wajib diisi"
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Harga harus berupa angka"
      });
    }

    if (numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak boleh negatif"
      });
    }

    const advertisement = await Advertisement.create({
      name: name.trim(),
      size: size.trim(),
      price: numericPrice,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: advertisement,
      message: "Iklan berhasil ditambahkan"
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan iklan",
      error: error.message
    });
  }
};

// Update advertisement
const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size, price } = req.body;

    // Check if advertisement exists
    const advertisement = await Advertisement.findByPk(id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Iklan tidak ditemukan"
      });
    }

    // Improved validation - same as create
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Nama iklan wajib diisi"
      });
    }

    if (!size || size.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Ukuran wajib diisi"
      });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({
        success: false,
        message: "Harga wajib diisi"
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "Harga harus berupa angka"
      });
    }

    if (numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Harga tidak boleh negatif"
      });
    }

    await advertisement.update({
      name: name.trim(),
      size: size.trim(),
      price: numericPrice,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      data: advertisement,
      message: "Iklan berhasil diperbarui"
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui iklan",
      error: error.message
    });
  }
};

// Delete advertisement
const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findByPk(id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Iklan tidak ditemukan"
      });
    }

    await advertisement.destroy();

    res.status(200).json({
      success: true,
      message: "Iklan berhasil dihapus"
    });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus iklan",
      error: error.message
    });
  }
};

// Get single advertisement
const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findByPk(id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Iklan tidak ditemukan"
      });
    }

    res.status(200).json({
      success: true,
      data: advertisement,
      message: "Data iklan berhasil diambil"
    });
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data iklan",
      error: error.message
    });
  }
};

module.exports = {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisementById
};