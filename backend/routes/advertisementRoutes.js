const express = require("express");
const router = express.Router();
const {
  getAdvertisements,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisementById
} = require("../controllers/advertisementController");

// Routes untuk advertisement
router.get("/", getAdvertisements);           // GET /api/advertisements
router.post("/", createAdvertisement);        // POST /api/advertisements
router.get("/:id", getAdvertisementById);     // GET /api/advertisements/:id
router.put("/:id", updateAdvertisement);      // PUT /api/advertisements/:id
router.delete("/:id", deleteAdvertisement);   // DELETE /api/advertisements/:id

module.exports = router;