import express from "express";
import dotenv from "dotenv";
import mongoAdmin from "./src/config/mongoAdmin.js";
import userRoutes from "./src/routes/userRoute.js";
import otpRoutes from "./src/routes/otpRoute.js"

// Load env variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);

app.use("/",(req,res)=>{
 res.send("Server is running successfully!!");
});
// -----------------------------
// Error handling middleware
// -----------------------------
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  // Default to 500 if status not provided
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something failed!!",
  });
});

// Start Server Function
const startServer = async () => {
  try {
    await mongoAdmin(); // Connect to MongoDB
    const port = 5000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
