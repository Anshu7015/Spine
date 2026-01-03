import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    //If we want to update and delete a coin, we have to delete and update it via coinIndex.
    coinIndex : {type : Number, required : true },
    coinQuantity : {type : Number, required : true},
    discount : {type : Boolean, default : false},
    discountedPrice : {type : Number, default : null},
    price : {type : Number, required : true},
    currency : {type : String, default : "INR"},
});

export default mongoose.model("Coin", coinSchema);