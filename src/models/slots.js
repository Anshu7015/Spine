import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: true ,required : true },
    roomPassword: { type: String, required: true },
    matchType: { type: String, required: true },
    manager: { type: mongoose.Types.ObjectId, ref: "Manager", required: true },
    teamA: { type: mongoose.Types.ObjectId, ref: "User" },
    teamAStatus: {
      type: String,
      default: "pending",
      enum: ["paid", "pending"],
    },
    teamB: { type: mongoose.Types.ObjectId, ref: "User" },
    teamBStatus: {
      type: String,
      default: "pending",
      enum: ["paid", "pending"],
    },
    matchStatus: {
      type: String,
      enum: ["pending", "ready", "running", "completed"],
      default : "pending"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Slot", slotSchema);