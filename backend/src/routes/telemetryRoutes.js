/**
 * @file telemetryRoutes.js
 * @description Routes for Telemetry APIs.
 */

const express = require("express");
const router = express.Router();

const {
  getAllTelemetry,
  getTelemetryByVehicleId,
} = require("../controllers/telemetryController");

/**
 * @route GET /api/telemetry
 * @description Get all telemetry records
 */
router.get("/", getAllTelemetry);

/**
 * @route GET /api/telemetry/:vehicleId
 * @description Get telemetry records for a specific vehicle
 */
router.get("/:vehicleId", getTelemetryByVehicleId);

module.exports = router;
