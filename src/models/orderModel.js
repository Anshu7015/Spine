import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    //The attributes can changed according to the playServices response(json).
    userId : {type : mongoose.Types.ObjectId, ref : "User"},
    orderId : {type : String, required : true , unique : true} ,
    coinId : {type : mongoose.Types.ObjectId, ref : "Coin"},
    token : {type : String, unique : true, required : true},
    used : {type : Boolean, default : false},//It should turn to true when the user used the token or the coin credited to his acc.
    amount : {type : Number , required : true},
    status : {type : String , required : true, enum : ["successful","unsuccessful"]},
    expiresAt : {
        type : Date,
        index : {expireAfterSeconds : 0},
    }
},
{timestamps : true}
);