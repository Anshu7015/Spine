import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  name: { type: String, min: 3, max: 30, required: true },
  phone: { type: Number, required: true, unique:true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Basic email regex to check correct format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      error: "Please enter a valid email address",
    },
    unique : true
  },
  authorized : {type: Boolean, default : false},
  //SPINE
  MID : {type : String,default : null},
  password : {type : String, default : null},
},
{timestamps}
);

export default mongoose.model("Manager",managerSchema);