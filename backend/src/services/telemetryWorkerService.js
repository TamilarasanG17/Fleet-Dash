/**
 * @file telemetryWorkerService.js
 * @description Service for executing the telemetry worker thread.
 * It sends raw telemetry data to the worker and returns the parsed
 * telemetry data as a Promise.
 */

const path = require("path");
const { Worker } = require("worker_threads");

/**
 * Runs the telemetry worker thread.
 *
 * @param {Array<Object>} telemetryData - Raw telemetry records.
 * @returns {Promise<Array<Object>>} Parsed telemetry records.
 */
const processTelemetryData = (telemetryData) => {
  return new Promise((resolve, reject) => {
    // Create worker instance
    const worker = new Worker(
      path.join(__dirname, "../workers/telemetryWorker.js")
    );

    // Send telemetry data to the worker
    worker.postMessage(telemetryData);

    // Receive parsed data from the worker
    worker.on("message", (result) => {
      if (result.success) {
        resolve(result.data);
      } else {
        reject(new Error(result.error?.message || "Worker failed to process telemetry data."));
      }

      // Clean up worker after processing
      worker.terminate();
    });

    // Handle worker runtime errors
    worker.on("error", (error) => {
      reject(error);
    });

    // Handle unexpected worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped unexpectedly with exit code ${code}.`));
      }
    });
  });
};

module.exports = processTelemetryData;