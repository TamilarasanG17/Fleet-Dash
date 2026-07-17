const telemetryData = require("../sampleData/telemetryData.json");
const { publishTelemetry } = require("../redis/publisher");

const startTelemetryGenerator = () => {
  console.log("Telemetry Generator Started...");

  let index = 0;

  setInterval(async () => {
    const telemetry = {
      ...telemetryData[index],
      speed: telemetryData[index].speed + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
    };

    await publishTelemetry(telemetry);

    console.log(
      `Published Telemetry -> ${telemetry.vehicleId} | Speed: ${telemetry.speed}`
    );

    index = (index + 1) % telemetryData.length;
  }, 2000);
};

module.exports = {
  startTelemetryGenerator,
};