const geofenceData = require("../sampleData/geofences.json");

// Get All Geofences
const getAllGeofences = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: geofenceData.length,
      data: geofenceData,
    });
  } catch (error) {
    console.error("Error fetching geofences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch geofences",
    });
  }
};

module.exports = {
  getAllGeofences,
};