require("dotenv").config();

const http = require("http");

const app = require("./app");
const connectDB = require("./config/mongo");
const redis = require("./config/redis");
const { initializeSocket } = require("./config/socket");
const { startTelemetryGenerator } = require("./services/telemetryGenerator");

require("./redis/subscriber");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Check Redis Connection
    await redis.ping();

    // Initialize Socket.io
    initializeSocket(server);

    // Start Continuous Telemetry Generator
    startTelemetryGenerator();

    // Start HTTP Server
    server.listen(PORT, () => {
      console.log(`FleetDash Backend is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();