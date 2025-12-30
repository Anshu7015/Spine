import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  slotID : {type : mongoose.Types.ObjectId, ref : "Slot"},
  UID: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  amountPaid: { type: Number, required: true },
  currency : {type : String,required : true},
},
{timestamps : true}
);

export default mongoose.model("Payment", paymentSchema);