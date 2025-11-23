import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    matchId : {type : String, unique : true},
    matchType : {type : String, required : true},
    manager : {type : mongoose.Types.ObjectId, ref : "Manager", required : true},
    Team1 : {type : String, required : true},
    Team2 : {type : String, required : true},
    paymentId : {type : String , required : true},
});

export default mongoose.model("Slot", slotSchema);