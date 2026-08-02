const {
  getAllAlerts,
  getAlertsByVehicle,
} = require("../services/alertService");

// Get all alerts
const fetchAllAlerts = async (req, res) => {
  try {
    const alerts = await getAllAlerts();

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get alerts by vehicle ID
const fetchAlertsByVehicle = async (req, res) => {
  try {
    const alerts = await getAlertsByVehicle(
      req.params.vehicleId
    );

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  fetchAllAlerts,
  fetchAlertsByVehicle,
};