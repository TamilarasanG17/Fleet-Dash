/**
 * @file vehicleController.js
 * @description Controller for handling Vehicle API requests.
 * Currently, vehicle data is served from mock JSON data.
 * MongoDB integration will be implemented in Day 5.
 */

const vehicles = require("../sampleData/vehicles.json");

/**
 * Get all vehicles.
 *
 * @route GET /api/vehicles
 * @returns {Object} List of all vehicles.
 */
const getAllVehicles = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles.",
    });
  }
};

/**
 * Get a vehicle by its ID.
 *
 * @route GET /api/vehicles/:vehicleId
 * @param {string} vehicleId - Vehicle ID
 * @returns {Object} Vehicle details
 */
const getVehicleById = (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = vehicles.find(
      (item) => item.vehicleId === vehicleId
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle.",
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
};