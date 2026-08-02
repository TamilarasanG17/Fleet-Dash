const Redis = require("ioredis");
const { getIO } = require("../config/socket");
const { checkGeofence } = require("../utils/geofenceChecker");
const { saveAlert } = require("../services/alertService");

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

let telemetryCount = 0;

// Store previous geofence state of every vehicle
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

subscriber.on("message", async (channel, message) => {
  try {
    const data = JSON.parse(message);
    telemetryCount++;

    console.log(
      `Received telemetry #${telemetryCount} for ${data.vehicleId}`
    );

    // Validate telemetry
    if (
      !data.vehicleId ||
      data.latitude === undefined ||
      data.longitude === undefined ||
      data.speed === undefined
    ) {
      console.warn("Invalid telemetry received. Skipping broadcast.");
      return;
    }

    // Check Geofence
    const geofenceResult = checkGeofence(data);

    if (geofenceResult.inside) {
      console.log(
        `${data.vehicleId} is inside ${geofenceResult.geofence}`
      );
    } else {
      console.log(`${data.vehicleId} is outside all geofences`);
    }

    // Previous vehicle state
    const previousState = vehicleStates[data.vehicleId] || {
      inside: false,
      geofence: null,
    };

    // Update current state
    vehicleStates[data.vehicleId] = {
      inside: geofenceResult.inside,
      geofence: geofenceResult.geofence,
    };

    const io = getIO();

    // Broadcast telemetry
    io.emit("telemetry-update", data);

    // Vehicle ENTERED Geofence
  
    if (!previousState.inside && geofenceResult.inside) {
      const alert = {
        type: "ENTER",
        vehicleId: data.vehicleId,
        geofence: geofenceResult.geofence,
        timestamp: new Date().toISOString(),
        message: `${data.vehicleId} entered ${geofenceResult.geofence}`,
      };
      await saveAlert(alert);

      io.emit("geofence-alert", alert);

      console.log(
        `Geofence Alert Sent -> ENTER | ${data.vehicleId} | ${geofenceResult.geofence}`
      );
    }

  
    // Vehicle EXITED Geofence
   
    if (previousState.inside && !geofenceResult.inside) {
      const alert = {
        type: "EXIT",
        vehicleId: data.vehicleId,
        geofence: previousState.geofence,
        timestamp: new Date().toISOString(),
        message: `${data.vehicleId} exited ${previousState.geofence}`,
      };
      await saveAlert(alert);

      io.emit("geofence-alert", alert);

      console.log(
        `Geofence Alert Sent -> EXIT | ${data.vehicleId} | ${previousState.geofence}`
      );
    }

    console.log("Telemetry broadcasted successfully");
  } catch (error) {
    console.error("Message Handler Error:", error.message);
  }
});

subscriber.on("error", (error) => {
  console.error("Subscriber Error:", error.message);
});

module.exports = subscriber;