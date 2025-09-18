const express = require("express");
const router = express.Router();
const {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisementById
} = require("../controllers/advertisementController");

router.get("/", getAdvertisements);
router.post("/", createAdvertisement);
router.get("/:id", getAdvertisementById);
router.put("/:id", updateAdvertisement);
router.delete("/:id", deleteAdvertisement);

module.exports = router;