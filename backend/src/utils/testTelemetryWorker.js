/**
 * @file testTelemetryWorker.js
 * @description Utility script to test the telemetry worker service.
 * This script loads sample telemetry data, processes it using the
 * Worker Thread, and prints the parsed output to the console.
 */

const telemetryData = require("../sampleData/telemetryData.json");
const processTelemetryData = require("../services/telemetryWorkerService");

(async () => {
  try {
    console.log("Starting telemetry worker test...\n");

    const parsedTelemetry = await processTelemetryData(telemetryData);

    console.log("Telemetry parsed successfully.\n");
    console.table(parsedTelemetry);

    console.log("\nWorker Thread test completed successfully.");
  } catch (error) {
    console.error("Worker Thread test failed.");
    console.error(error.message);
  }
})();