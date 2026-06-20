const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  url: String,
  displayText: String,
  isSuspicious: Boolean,
  reason: String,
});

const threatSchema = new mongoose.Schema({
  category: String,
  detail: String,
  score: Number,
});

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emailData: {
      subject: {
        type: String,
        required: true,
        trim: true,
      },
      sender: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ["safe", "suspicious", "high risk", "likely phishing", "dangerous"],
      required: true,
    },
    threats: [threatSchema],
    links: [linkSchema],
    urgencyScore: {
      type: Number,
      default: 0,
    },
    domainRisk: {
      type: Number,
      default: 0,
    },
    grammarScore: {
      type: Number,
      default: 0,
    },
    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scan", scanSchema);