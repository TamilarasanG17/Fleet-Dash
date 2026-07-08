/**
 * @file telemetryWorker.js
 * @description Worker Thread responsible for parsing and validating
 * telemetry data in the background. It receives raw telemetry data
 * from the main thread, processes it using the telemetry parser,
 * and sends the parsed result or an error back to the main thread.
 */

const { parentPort } = require("worker_threads");
const parseTelemetryData = require("../parsers/telemetryParser");

// Ensure this file is executed as a Worker Thread
if (!parentPort) {
  throw new Error("telemetryWorker.js must be executed as a Worker Thread.");
}

// Listen for telemetry data from the main thread
parentPort.on("message", (telemetryData) => {
  try {
    // Parse and validate incoming telemetry data
    const parsedTelemetry = parseTelemetryData(telemetryData);

    // Send parsed telemetry back to the main thread
    parentPort.postMessage({
      success: true,
      data: parsedTelemetry,
    });
  } catch (error) {
    // Send error details back to the main thread
    parentPort.postMessage({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
});