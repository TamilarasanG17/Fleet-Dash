/**
 * @file telemetryController.js
 * @description Controller for handling Telemetry API requests.
 * Telemetry data is fetched from MongoDB using the service layer.
 */

const {
  getAllTelemetry: getAllTelemetryService,
  getTelemetryByVehicleId: getTelemetryByVehicleIdService,
} = require("../services/telemetryService");

/**
 * Get all telemetry records.
 *
 * @route GET /api/telemetry
 * @returns {Object} List of telemetry records.
 */
const getAllTelemetry = async (req, res) => {
  try {
    const telemetryData = await getAllTelemetryService();

    res.status(200).json({
      success: true,
      count: telemetryData.length,
      data: telemetryData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch telemetry data.",
      error: error.message,
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
const getTelemetryByVehicleId = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const telemetryData = await getTelemetryByVehicleIdService(vehicleId);

    if (!telemetryData || telemetryData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Telemetry data not found for the specified vehicle.",
      });
    }

    res.status(200).json({
      success: true,
      count: telemetryData.length,
      data: telemetryData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch telemetry data.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTelemetry,
  getTelemetryByVehicleId,
};