// Service for handling telemetry database operations

const TelemetryBucket = require("../models/TelemetryBucket");

/**
 * Store telemetry records using the MongoDB Bucket Pattern.
 *
 * @param {Array} telemetryData - Array of parsed telemetry objects.
 */
const storeTelemetry = async (telemetryData) => {
  for (const record of telemetryData) {
    // Bucket starts from the beginning of the current hour
    const bucketStartTime = new Date(record.timestamp);
    bucketStartTime.setMinutes(0, 0, 0);

    // Check if a bucket already exists
    let bucket = await TelemetryBucket.findOne({
      vehicleId: record.vehicleId,
      bucketStartTime,
    });

    if (!bucket) {
      // Create a new bucket
      bucket = new TelemetryBucket({
        vehicleId: record.vehicleId,
        bucketStartTime,
        telemetry: [],
      });
    }

    // Add telemetry record
    bucket.telemetry.push({
      latitude: record.latitude,
      longitude: record.longitude,
      speed: record.speed,
      heading: record.heading,
      timestamp: record.timestamp,
    });

    // Save bucket
    await bucket.save();
  }
};

/**
 * Fetch telemetry for all vehicles.
 *
 * @returns {Promise<Array>}
 */
const getAllTelemetry = async () => {
 return await TelemetryBucket.find(
  {},
  {
    vehicleId: 1,
    bucketStartTime: 1,
    telemetry: 1,
    _id: 0,
  }
);
};

/**
 * Fetch telemetry for a specific vehicle.
 *
 * @param {string} vehicleId
 * @returns {Promise<Array>}
 */
const getTelemetryByVehicleId = async (vehicleId) => {
  return await TelemetryBucket.find(
  { vehicleId },
  {
    vehicleId: 1,
    bucketStartTime: 1,
    telemetry: 1,
    _id: 0,
  }
);
};

module.exports = {
  storeTelemetry,
  getAllTelemetry,
  getTelemetryByVehicleId,
};