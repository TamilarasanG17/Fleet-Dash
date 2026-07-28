const mongoose = require("mongoose");

const geofenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Polygon"],
      default: "Polygon",
    },

    coordinates: {
      type: [[[Number]]],
      required: true,
    },

    color: {
      type: String,
      default: "#2563EB",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Geofence", geofenceSchema);