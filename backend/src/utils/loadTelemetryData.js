// Utility script to load sample telemetry data into MongoDB

require("dotenv").config();
const path = require("path");

const connectDB = require("../config/mongo");
const parseTelemetryData = require("../parsers/telemetryParser");
const { storeTelemetry } = require("../services/telemetryService");

// Import sample telemetry data
const telemetryData = require(path.join(
  __dirname,
  "../sampleData/telemetryData.json"
));

const loadTelemetryData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Connected to MongoDB.");

    // Parse sample telemetry
    const parsedTelemetry = parseTelemetryData(telemetryData);

    // Store in MongoDB
    await storeTelemetry(parsedTelemetry);

    console.log("Telemetry data loaded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Failed to load telemetry data:", error.message);
    process.exit(1);
  }
};

loadTelemetryData();