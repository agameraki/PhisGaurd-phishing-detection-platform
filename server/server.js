const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");
const historyRoutes = require("./routes/historyRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Import middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Middleware
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/payment", paymentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "PhishGuard API is running",
    status: "healthy",
    version: "1.0.0"
  });
});

// Error middleware (must be last)
app.use(errorMiddleware);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});