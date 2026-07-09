/**
 * @file vehicleRoutes.js
 * @description Routes for Vehicle APIs.
 */

const express = require("express");
const router = express.Router();

const {
  getAllVehicles,
  getVehicleById,
} = require("../controllers/vehicleController");

/**
 * @route GET /api/vehicles
 * @description Get all vehicles
 */
router.get("/", getAllVehicles);

/**
 * @route GET /api/vehicles/:vehicleId
 * @description Get vehicle details by vehicle ID
 */
router.get("/:vehicleId", getVehicleById);

module.exports = router;