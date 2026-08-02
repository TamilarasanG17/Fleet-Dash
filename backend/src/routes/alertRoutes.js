const express = require("express");

const {
  fetchAllAlerts,
  fetchAlertsByVehicle,
} = require("../controllers/alertController");

const router = express.Router();

// Get all alerts
router.get("/", fetchAllAlerts);

// Get alerts by vehicle ID
router.get("/:vehicleId", fetchAlertsByVehicle);

module.exports = router;