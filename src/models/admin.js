import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName : {type : String},
    email : {type : String, required : true},
    password : {type : String, required : true}
});

export default mongoose.model("Admin",adminSchema);