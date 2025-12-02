import mongoose from "mongoose";

const freefireSchema = new mongoose.Schema({

    title : {type : String, required : true, min: 2},
    subtitle : {type : String , required : true, min : 2},
    cardIndex : {type : Number, required : true},
    rupeesAmount:{type : Number, required : true},
    teamType : {type : String, required : true, enum : ["solo", "duo", "squad"]},
    rounds : {type : String, required : true},
    coinAmount : {type :Number,required : true},

});

export default mongoose.model("FreeFire", freefireSchema);