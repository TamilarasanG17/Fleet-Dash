const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FleetDash Backend Running",
  });
});

// Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/telemetry", telemetryRoutes);

module.exports = app;