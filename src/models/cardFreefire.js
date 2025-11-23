import mongoose from "mongoose";

const freefireSchema = new mongoose.Schema({

    title : {type : String, required : true, min: 2},
    subtitle : {type : String , required : true, min : 2},
    cardIndex : {type : Number, required : true},
    amount:{type : Number, required : true}

});

export default mongoose.model("FreeFire", freefireSchema);