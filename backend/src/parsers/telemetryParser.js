/**
 * Parses and validates raw telemetry data.
 *
 * Converts incoming values to the required data types before
 * they are processed by the worker thread or stored in MongoDB.
 *
 * @param {Array<Object>} telemetryData - Raw telemetry records.
 * @returns {Array<Object>} Parsed telemetry records.
 * @throws {Error} If the input or any record is invalid.
 */

const parseTelemetryData = (telemetryData) => {
  // Validate input
  if (!Array.isArray(telemetryData)) {
    throw new Error("Telemetry data must be an array.");
  }

  return telemetryData.map((vehicle, index) => {
    const {
      vehicleId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp,
    } = vehicle;

    // Check required fields
    if (
      !vehicleId ||
      latitude === undefined ||
      longitude === undefined ||
      speed === undefined ||
      heading === undefined ||
      !timestamp
    ) {
      throw new Error(
        `Invalid telemetry record at index ${index}: Missing required fields.`
      );
    }

    const parsedTelemetry = {
      vehicleId: String(vehicleId),
      latitude: Number(latitude),
      longitude: Number(longitude),
      speed: Number(speed),
      heading: Number(heading),
      timestamp: new Date(timestamp),
    };

    // Validate numeric fields
    if (
      Number.isNaN(parsedTelemetry.latitude) ||
      Number.isNaN(parsedTelemetry.longitude) ||
      Number.isNaN(parsedTelemetry.speed) ||
      Number.isNaN(parsedTelemetry.heading)
    ) {
      throw new Error(
        `Invalid telemetry record at index ${index}: Numeric fields must contain valid numbers.`
      );
    }

    // Validate timestamp
    if (Number.isNaN(parsedTelemetry.timestamp.getTime())) {
      throw new Error(
        `Invalid telemetry record at index ${index}: Invalid timestamp.`
      );
    }

    return parsedTelemetry;
  });
};

module.exports = parseTelemetryData;