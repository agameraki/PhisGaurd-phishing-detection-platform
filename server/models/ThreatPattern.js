const mongoose = require("mongoose");

const threatPatternSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "urgency",
        "greed",
        "fear",
        "impersonation",
        "suspicious_domain",
        "grammar",
      ],
      required: true,
    },
    pattern: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    description: {
      type: String,
      required: true,
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

module.exports = mongoose.model("ThreatPattern", threatPatternSchema);