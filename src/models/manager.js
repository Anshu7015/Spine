import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const managerSchema = new mongoose.Schema({
  managerName: { type: String, min: 3, max: 30, required: true },
  phone: { type: String, required: true, unique:true , minlength : 10, index : true},
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
      message: "Please enter a valid email address",
    },
    unique : true,
    index : true
  },
  gameType : {type : String, enum : ["freeFire", "mobileLegends"]},
  authorized : {type: Boolean, default : false},
  banned : {type : Boolean, default : false},
  //SpineManger000
  MID : {type : String,default : null},
  password : {type : String, default : null},
  passwordChanged : {type : Boolean, default : false},//It helps to check if the manager changed his password or not
  tempPassExpiresAt : {type : Date, default : null},
  accessToken : {type : String},
  refreshToken : {type : String},
  sessionActive : {type : Boolean , default : false},
  money : {type : Number, default : 0, min : 0}
},
{timestamps : true}
);


//Pre-save hook to hash password
managerSchema.pre("save", async function (next) {
  //If password is not modified, just skip it don't hash it again.
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

//Method to compare password(to be implemented with bcrypt).
//Used for login time.
managerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//JWT (Generate and Refresh Token)
managerSchema.methods.generateAccessToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id, email: this.email, name: this.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
    return token;
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};

managerSchema.methods.generateRefreshToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
    );
    return token;
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};

export default mongoose.model("Manager",managerSchema);