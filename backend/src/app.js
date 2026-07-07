const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FleetDash Backend Running ",
  });
});

module.exports = app;