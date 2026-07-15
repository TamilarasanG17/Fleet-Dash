require("dotenv").config();

const http = require("http");
const { initializeSocket } = require("./config/socket");
const app = require("./app");
const connectDB = require("./config/mongo");
const redis = require("./config/redis");
require("./redis/subscriber");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    await redis.ping();
  
    initializeSocket(server);

    server.listen(PORT, () => {
      console.log(`FleetDash Backend is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();