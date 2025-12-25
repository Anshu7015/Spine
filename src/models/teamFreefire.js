//This model will be used to generate a single team , and this will be used in 1v1 team slot or in BR, by registering the teams into the slots.
import mongoose from "mongoose";

const freefireTeamSchema = mongoose.Schema({

    userUID : {type : mongoose.Types.ObjectId, ref : "User"},
    phone : {type : String, required : true, min:10, max:10},
    yourUID : {type : String, required : true},
    teamName : {type : String , required : true},
    player1 : {type : String, required : true},
    player2 : {type : String, required : true},
    player3 : {type : String, required : true},
    player4 : {type : String, required : true},

});

export default mongoose.model("TeamFreefire",freefireTeamSchema);