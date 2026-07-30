const express = require("express");
const { getAllGeofences } = require("../controllers/geofenceController");

const router = express.Router();

// Get all geofences
router.get("/", getAllGeofences);

module.exports = router;