import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  UID: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  amountPaid: { type: Number, required: true },
  Reason: { type: String, enum: ["tokens", "match"] },
});

export default mongoose.model("Payment", paymentSchema);