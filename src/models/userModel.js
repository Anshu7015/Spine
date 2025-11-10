import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userPassword: {
      type: String,
      required: true,
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

    userId: {
      type: String,
      unique: true,
    },

    contact: {
      type: String,
      required: true,
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
      enum: ["allowed", "banned", "suspended"],
      default: "allowed",
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
        const lastUser = await this.constructor.findOne({}, {}, 
            {sort : {"userId" : -1} });//Sort in descending order to get the last userId
        const lastId = lastUser ? parseInt(lastUser.userId.replace("UID", "")) : 0;
        this.userId = `UID${String(lastId + 1).padStart(3, "0")}`; 
        next();

    } catch (error) {
        console.error("Error generating userId:", error);
        next(error);
    }
});


//Pre-save hook to hash password
userSchema.pre("save", async function (next){
    //If userPassword is not modified, just skip it don't hash it again.
    if(!this.isModified("userPassword")) return next();
    
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

export default mongoose.model("User", userSchema);