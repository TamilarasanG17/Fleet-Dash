const mongoose = require("mongoose");

// Schema for a single telemetry record
const telemetrySchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    speed: {
      type: Number,
      required: true,
    },

    heading: {
      type: Number,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false, // No separate _id for every telemetry point
  }
);

// Schema for one hourly telemetry bucket
const telemetryBucketSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      trim: true,
    },

    bucketStartTime: {
      type: Date,
      required: true,
    },

    telemetry: {
      type: [telemetrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
telemetryBucketSchema.index({
  vehicleId: 1,
  bucketStartTime: 1,
});

module.exports = mongoose.model(
  "TelemetryBucket",
  telemetryBucketSchema
);