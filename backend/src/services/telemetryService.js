// Service for handling telemetry database operations

const TelemetryBucket = require("../models/TelemetryBucket");

/**
 * Store telemetry records using the MongoDB Bucket Pattern.
 *
 * Performance optimized:
 * - Groups records by vehicle and hourly bucket.
 * - Uses bulkWrite instead of findOne + save for every record.
 * - Reduces MongoDB round trips significantly.
 *
 * @param {Array} telemetryData - Array of parsed telemetry objects.
 */
const storeTelemetry = async (telemetryData) => {
  if (!Array.isArray(telemetryData) || telemetryData.length === 0) {
    return;
  }

  const bucketMap = new Map();

  for (const record of telemetryData) {
    const bucketStartTime = new Date(record.timestamp);
    bucketStartTime.setMinutes(0, 0, 0);

    const key = `${record.vehicleId}_${bucketStartTime.getTime()}`;

    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        vehicleId: record.vehicleId,
        bucketStartTime,
        telemetry: [],
      });
    }

    bucketMap.get(key).telemetry.push({
      latitude: record.latitude,
      longitude: record.longitude,
      speed: record.speed,
      heading: record.heading,
      timestamp: record.timestamp,
    });
  }

  const operations = Array.from(bucketMap.values()).map((bucket) => ({
    updateOne: {
      filter: {
        vehicleId: bucket.vehicleId,
        bucketStartTime: bucket.bucketStartTime,
      },
      update: {
        $push: {
          telemetry: {
            $each: bucket.telemetry,
          },
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await TelemetryBucket.bulkWrite(operations);
  }
};

/**
 * Fetch telemetry for all vehicles.
 *
 * Performance optimized using lean()
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
  ).lean();
};

/**
 * Fetch telemetry for a specific vehicle.
 *
 * Performance optimized using lean()
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
  ).lean();
};

module.exports = {
  storeTelemetry,
  getAllTelemetry,
  getTelemetryByVehicleId,
};