const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      trim: true,
    },

    geofence: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["ENTER", "EXIT"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);