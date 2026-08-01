const Redis = require("ioredis");
const { getIO } = require("../config/socket");
const { checkGeofence } = require("../utils/geofenceChecker");

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});
let telemetryCount = 0;
// Store previous geofence state
const vehicleStates = {};

subscriber.on("connect", async () => {
  console.log("Redis Subscriber connected");

  try {
    await subscriber.subscribe("telemetry");
    console.log("Subscribed to telemetry channel");
  } catch (error) {
    console.error("Subscription Error:", error.message);
  }
});

subscriber.on("message", (channel, message) => {
  try {
    const data = JSON.parse(message);
    telemetryCount++;

console.log(`Received telemetry #${telemetryCount} for ${data.vehicleId}`);
const geofenceResult = checkGeofence(data);

if (geofenceResult.inside) {
  console.log(
    `${data.vehicleId} is inside ${geofenceResult.geofence}`
  );
} else {
  console.log(`${data.vehicleId} is outside all geofences`);
}
// Get previous state of the vehicle
const previousState = vehicleStates[data.vehicleId] || {
  inside: false,
  geofence: null,
};
// Detect vehicle entering a geofence
if (!previousState.inside && geofenceResult.inside) {
  console.log(
    ` ${data.vehicleId} ENTERED ${geofenceResult.geofence}`
  );
}

// Detect vehicle exiting a geofence
if (previousState.inside && !geofenceResult.inside) {
  console.log(
    `${data.vehicleId} EXITED ${previousState.geofence}`
  );
}

    // Validate required telemetry fields
    if (
      !data.vehicleId ||
      data.latitude === undefined ||
      data.longitude === undefined ||
      data.speed === undefined
    ) {
      console.warn("Invalid telemetry received. Skipping broadcast.");
      return;
    }

    console.log(`Received telemetry for ${data.vehicleId}`);
    // Update current state
    vehicleStates[data.vehicleId] = {
     inside: geofenceResult.inside,
     geofence: geofenceResult.geofence,
     };

    const io = getIO();

    io.emit("telemetry-update", data);

    console.log("Telemetry broadcasted successfully");
  } catch (error) {
    console.error("Message Handler Error:", error.message);
  }
});

subscriber.on("error", (error) => {
  console.error("Subscriber Error:", error.message);
});

module.exports = subscriber;