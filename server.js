import express from "express";
import dotenv from "dotenv";
import mongoAdmin from "./src/config/mongoAdmin.js";
import userRoutes from "./src/routes/userRoute.js";
import otpRoutes from "./src/routes/otpRoute.js";
import managerRoutes from "./src/routes/managerRoute.js";
import ffCardRoutes from "./src/routes/ffCardRoutes.js";
import mlbbCardRoutes from "./src/routes/mlbbCardRoutes.js";
import adminRoutes from "./src/routes/adminRoute.js";
import demoRoutes from "./src/routes/demoRoutes.js";
import ffSlotRoutes from "./src/routes/ffSlotRoutes.js";

// Load env variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/ffCard", ffCardRoutes);
app.use("/api/mlbbCard", mlbbCardRoutes);
app.use("/api/admin", adminRoutes);
app.use("api/demo",demoRoutes);
app.use("/api/ffSlots", ffSlotRoutes);

app.use("/",(req,res)=>{
 res.send("Server is running successfully!!");
});

//Temporary Error Handling Middleware
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
