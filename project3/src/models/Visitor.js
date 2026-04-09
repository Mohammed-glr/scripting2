const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      default: "Onbekend"
    },
    path: {
      type: String,
      required: true
    },
    referrer: {
      type: String,
      default: "Direct"
    },
    method: {
      type: String,
      required: true
    },
    visitedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("Visitor", visitorSchema);
