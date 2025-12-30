import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    slotId : {type : String,unique : true},
    roomId: { type: String },
    roomPassword: { type: String },
    gameType: { type: String, required: true },
    manager: { type: mongoose.Types.ObjectId, ref: "Manager" },

    teamA: { type: mongoose.Types.ObjectId, ref: "TeamFreefire" },
    
    teamB: { type: mongoose.Types.ObjectId, ref: "TeamFreefire" },
    
    matchStatus: {
      type: String,
      enum: ["pending", "ready", "running", "completed"],
      default: "pending",
    }
  },
  { timestamps: true }
);


//Pre-save hook to generate TeamId
slotSchema.pre("save", async function(next) {
  //If doc already exists, skik it
  if (!this.isNew) return next();
  try {
    const lastMatch = await this.constructor.findOne(
      {},
      {},
      { sort : {slotId : -1} }
    );
  
    const lastId = lastMatch ? parseInt(lastMatch.slotId.replace("ffSlot","")) : 0; 
    this.slotId = `ffSlot${String(lastId + 1).padStart(3,"0")}`;
    next();
  }
  catch (error) {
    console.log(error);
    console.error("Error generating slotId");
    next(error);
  };

});


export default mongoose.model("Slot", slotSchema);