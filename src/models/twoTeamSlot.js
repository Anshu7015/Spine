import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    roomId: { type: String },
    roomPassword: { type: String },
    gameType: { type: String, required: true },
    manager: { type: mongoose.Types.ObjectId, ref: "Manager" },

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
    
    managerAssigned : {type : Boolean , default : false},
    matchStatus: {
      type: String,
      enum: ["pending", "ready", "running", "completed"],
      default : "pending"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Slot", slotSchema);