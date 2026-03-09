import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — fixes most Atlas connection issues on Windows
      dbName: "crispdb",
    });
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "Server will continue running but database operations will fail.",
    );
    console.error("Please check:");
    console.error(
      "  1. Your IP is whitelisted in MongoDB Atlas (Network Access)",
    );
    console.error("  2. Your MONGO_URI in .env is correct");
    console.error("  3. Your Atlas cluster is running (not paused)");
  }
};

export default connectDB;
