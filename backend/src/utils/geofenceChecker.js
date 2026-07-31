const turf = require("@turf/turf");
const geofences = require("../sampleData/geofences.json");

const checkGeofence = (telemetry) => {
  // Create vehicle location point
  const vehiclePoint = turf.point([
    telemetry.longitude,
    telemetry.latitude,
  ]);

  for (const geofence of geofences) {
    const polygon = turf.polygon(geofence.coordinates);

    const isInside = turf.booleanPointInPolygon(
      vehiclePoint,
      polygon
    );

    if (isInside) {
      return {
        inside: true,
        geofence: geofence.name,
      };
    }
  }

  return {
    inside: false,
    geofence: null,
  };
};

module.exports = {
  checkGeofence,
};