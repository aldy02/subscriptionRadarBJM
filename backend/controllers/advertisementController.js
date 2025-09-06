const { Advertisement, AdvertisementContent } = require("../models");

// Get all advertisement packages
exports.getAllPackages = async (req, res) => {
  try {
    const ads = await Advertisement.findAll({ order: [["created_at", "DESC"]] });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single advertisement package by ID
exports.getPackageById = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement package not found" });
    }
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get advertisement contents (active ads)
exports.getActiveAds = async (req, res) => {
  try {
    const ads = await AdvertisementContent.findAll({
      where: {
        start_date: { $ne: null },
        end_date: { $ne: null },
      },
      order: [["created_at", "DESC"]],
    });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};