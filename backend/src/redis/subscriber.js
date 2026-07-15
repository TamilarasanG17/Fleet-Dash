console.log("Subscriber file loaded");

const Redis = require("ioredis");
const { getIO } = require("../config/socket");

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

subscriber.on("connect", async () => {
  console.log("Redis Subscriber connected");

  try {
    await subscriber.subscribe("telemetry");
    console.log("Subscribed to telemetry channel");
  } catch (error) {
    console.error("Subscription Error:");
    console.error(error);
  }
});

subscriber.on("message", (channel, message) => {
  console.log("Message event triggered");

  console.log(`Received message from ${channel}:`);
  console.log(message);

  try {
    const io = getIO();

    console.log("Socket instance fetched");

    io.emit("telemetry-update", JSON.parse(message));

    console.log("Telemetry broadcasted to connected clients");
  } catch (error) {
    console.error("Message Handler Error:");
    console.error(error);
  }
});

subscriber.on("error", (error) => {
  console.error("Subscriber Full Error:");
  console.error(error);
});

module.exports = subscriber;