const Alert = require("../models/Alert");

/**
 * Save a geofence alert into MongoDB
 * @param {Object} alertData
 */
const saveAlert = async (alertData) => {
  const alert = new Alert(alertData);
  return await alert.save();
};

/**
 * Get all alerts
 */
const getAllAlerts = async () => {
  return await Alert.find().sort({ timestamp: -1 });
};

/**
 * Get alerts for a specific vehicle
 * @param {string} vehicleId
 */
const getAlertsByVehicle = async (vehicleId) => {
  return await Alert.find({ vehicleId }).sort({
    timestamp: -1,
  });
};

module.exports = {
  saveAlert,
  getAllAlerts,
  getAlertsByVehicle,
};