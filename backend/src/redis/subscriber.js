const Redis = require("ioredis");

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

subscriber.on("connect", () => {
  console.log("Redis Subscriber connected");
});

subscriber.on("message", (channel, message) => {
  console.log(`Received message from ${channel}:`);
  console.log(message);
});

subscriber.on("error", (error) => {
  console.error("Subscriber Error:", error.message);
});

// Subscribe only once
(async () => {
  try {
    await subscriber.subscribe("telemetry");
    console.log("Subscribed to telemetry channel");
  } catch (error) {
    console.error("Subscription Error:", error.message);
  }
})();

module.exports = subscriber;