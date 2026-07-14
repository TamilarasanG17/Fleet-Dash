const { publishTelemetry } = require("../redis/publisher");

const telemetryData = {
  vehicleId: "V001",
  speed: 65,
  latitude: 23.2599,
  longitude: 77.4126,
  timestamp: new Date(),
};

setTimeout(async () => {
  await publishTelemetry(telemetryData);
  process.exit();
}, 3000);