import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 5,
    },
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
    },
    userPassword: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      unique: true,
    },

    matchPlayed: {
      type: Number,
      default: 0,
    },

    matchWon: {
      type: Number,
      default: 0,
    },

    tokenCoins: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["allowed", "suspended"],
      default: "allowed",
    },

    accessToken : {
      type : String,
    },
    refreshToken : {
      type : String,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
 
// Pre-save hook to Generate default userId
userSchema.pre("save", async function (next) {
  //If this doc already exist just skip it.
  if (!this.isNew) return next();

  try {
    //Find the last userId and increment it
    //constructor points to the model and this points to the current document
    const lastUser = await this.constructor.findOne(
      {},
      {},
      { sort: { userId: -1 } }
    ); //Sort in descending order to get the last userId
    const lastId = lastUser ? parseInt(lastUser.userId.replace("UID", "")) : 0;
    this.userId = `UID${String(lastId + 1).padStart(3, "0")}`;
    next();
  } catch (error) {
    console.error("Error generating userId:", error);
    next(error);
  }
});

//Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  //If userPassword is not modified, just skip it don't hash it again.
  if (!this.isModified("userPassword")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.userPassword = await bcrypt.hash(this.userPassword, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

//Method to compare password(to be implemented with bcrypt).
//Used for login time.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.userPassword);
};

//JWT (Generate and Refresh Token)

userSchema.methods.generateAccessToken = async function () {
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

userSchema.methods.generateRefreshToken = async function () {
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

export default mongoose.model("User", userSchema);