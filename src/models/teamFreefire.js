//This model will be used to generate a single team , and this will be used in 1v1 team slot or in BR, by registering the teams into the slots.
import mongoose from "mongoose";

const freefireTeamSchema = new mongoose.Schema({
  //ffTeam001
  teamId : {type : String , unique : true},
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  phone: { type: String, required: true, min: 9, max: 11 },
  yourUID: { type: String, required: true },
  teamName: { type: String, required: true },
  player1: { type: String, required: true },
  player2: { type: String, required: true },
  player3: { type: String, required: true },
  player4: { type: String, required: true },
  paymentSuccess: { type: Boolean, default: false },
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 },
  },
},
{timestamps : true}
);

//Pre-save hook to generate TeamId
freefireTeamSchema.pre("save", async function(next) {
  //If doc already exists, skik it
  if (!this.isNew) return next();

  try {

    const lastMatch = await this.constructor.findOne(
      {},
      {},
      { sort : {teamId : -1} }
    );
  
    const lastId = lastMatch ? parseInt(lastMatch.teamId.replace("ffTeam", "")) : 0; 
    this.teamId = `ffTeam${String(lastId + 1).padStart(3,"0")}`;
    next();
  }
  catch (error) {
    console.log(error);
    console.error("Error generating teamId");
    next(error);
  };

});
export default mongoose.model("TeamFreefire",freefireTeamSchema);