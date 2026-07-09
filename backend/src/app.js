/**
 * @file app.js
 * @description Express application configuration.
 */

const express = require("express");

const vehicleRoutes = require("./routes/vehicleRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");

const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FleetDash Backend Running",
  });
});

// Vehicle APIs
app.use("/api/vehicles", vehicleRoutes);

// Telemetry APIs
app.use("/api/telemetry", telemetryRoutes);

module.exports = app;