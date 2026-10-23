
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Test API route
app.get("/", (req, res) => {
  res.status(200).send("MERN Auth API is running!");
});

// Server port
const PORT = process.env.PORT || 5000;

// Connect MongoDB and start server
async function startServer() {
  try {
    // Check MongoDB connection string
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

// Start application
startServer();
