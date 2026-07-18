const Redis = require("ioredis");

const publisher = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

publisher.on("connect", () => {
  console.log("Redis Publisher connected");
});

publisher.on("error", (error) => {
  console.error("Publisher Error:", error.message);
});

const publishTelemetry = async (telemetryData) => {
  try {
    const subscribers = await publisher.publish(
      "telemetry",
      JSON.stringify(telemetryData)
    );

    console.log(
      `Telemetry published successfully (${subscribers} subscriber(s))`
    );
  } catch (error) {
    console.error("Publish Error:", error.message);
  }
};

module.exports = {
  publisher,
  publishTelemetry,
};