/**
 * @file telemetryController.js
 * @description Controller for handling Telemetry API requests.
 * Currently, telemetry data is served from mock JSON data.
 * MongoDB integration will be implemented in Day 5.
 */

const telemetryData = require("../sampleData/telemetryData.json");

/**
 * Get all telemetry records.
 *
 * @route GET /api/telemetry
 * @returns {Object} List of telemetry records.
 */
const getAllTelemetry = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: telemetryData.length,
      data: telemetryData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch telemetry data.",
    });
  }
};

/**
 * Get telemetry records for a specific vehicle.
 *
 * @route GET /api/telemetry/:vehicleId
 * @param {string} vehicleId - Vehicle ID
 * @returns {Object} Telemetry records for the specified vehicle.
 */
const getTelemetryByVehicleId = (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicleTelemetry = telemetryData.filter(
      (record) => record.vehicleId === vehicleId
    );

    if (vehicleTelemetry.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Telemetry data not found for the specified vehicle.",
      });
    }

    res.status(200).json({
      success: true,
      count: vehicleTelemetry.length,
      data: vehicleTelemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch telemetry data.",
    });
  }
};

module.exports = {
  getAllTelemetry,
  getTelemetryByVehicleId,
};