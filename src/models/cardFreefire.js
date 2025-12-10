import mongoose from "mongoose";

const freefireSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 2 },

  subtitle: { type: String, required: true, min: 2 },

  cardIndex: { type: Number, required: true, unique : true },

  image: { type: String, required: true }, // image1.png

  lobbyTime: {type : Number , default : 10},

  minAge: { type: Number, default: 16 },

  teamSize: { type: Number, default: 5 },

  totalSquads: { type: Number, required: 
  true },

  rounds: { type: String, required: true }, // 5

  price: { type: Number, required: true },

  gamePrizeAmount: { type: Number, required: true },

  // coinAmount : {type :Number},
  gameType: { type: String, required: true }, // CS, BR

  game: { type: String, enum: ["ff", "mlbb"], default : "ff" }, // We don't need it bcz this card is dedicated to freefire
  
},
{timestamps : true}
);

//Function to generate gameId for backend filteration and integrity.
// freefireSchema.pre("save", async function(next) {
// if (!this.isNew) return next();
// try {
//     const lastGame = await this.constructor.findOne({},{},{ sort : {gameId : -1} });

//     const lastGameId = lastGame ? parseInt(lastGame.gameId.replace("UID", "")) : 0;
//     this.gameId  = `UID${String(lastGameId + 1).padStart(3, "0")}`;
//     next();

// } catch (error) {
//     console.error("Error generating the gameId",error);
//     next(error);
// };

// });

export default mongoose.model("FreeFire", freefireSchema);