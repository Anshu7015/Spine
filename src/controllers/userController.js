import User from "../models/userModel.js"; // adjust path as needed
import { createUserValidator } from "../validator/userValidator.js"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 1. Register User, POST Method (It will register the user to the DB.)
export const registerUser = async (req, res) => {
  try {
    // Validate input using Joi
    const { error, value } = createUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message,
      });
    }

    const {
      userName,
      age,
      email,
      userPassword,
    } = value;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already registered. Please login." });
    }

    // Create new user
    const newUser = new User({
      userName,
      age,
      email,
      userPassword,
    });

    // Save to DB (userId and password hashing handled by Mongoose hooks)
    await newUser.save();

    // Return success (without password)
    const userResponse = newUser.toObject();
    delete userResponse.userPassword;

    return res.status(201).json({
      message: "User registered successfully.",
      user: userResponse,
    });
    
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


//2. Login User,POST method () = It will take user's email and password and send back all the data of the user.(not password)
//Not having validator here, I will add if needed.

export const loginUser = async (req, res) => {
  try {
    const { email, userPassword } = req.body;

    // Check if both email and password are provided
    if (!email || !userPassword) {
      return res.status(400).json({
        message: "Email and Password required!!",
      });
    };

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first.",
      });
    }

    if (user.isEmailVerified !== true) {
      return res.status(400).json({
        success : false,
        message : "Verify your mail before login."
      });
    }

    // Compare entered password with stored hash
    const isMatch = await user.comparePassword(userPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your password.",
      });
    }

    // Check if user is suspended
      if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Try again later.",
      });
    }

    // If login successful and email not verified, trigger OTP process.
    if (!user.isEmailVerified) {
      return res.status(200).json({
        message: "Login successful. Please verify your email via OTP.",
        userId: user._id, // send this for OTP verification step
        otpRequired: true,
      });
    };

    //Generate Tokens.
    const accessToken = await user.generateAccessToken();
    const refresToken = await user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refresToken;

    await user.save();//Saving the JWT tokens.

    const userData = user.toObject();
    delete userData.userPassword;

    // If already verified
    return res.status(200).json({
      message: "Login successful.",
      userData,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Internal server error1.",
    });
  }
};

// 3. Refresh Access Token

export const refreshAccessToken = async function (req,res) {
    try {

      const {email,refreshToken} = req.body;

      if (!refreshToken || !email) {
        return res.status(401).json({
          message: "Refresh Token and email required!!"
        });
      };

      //Find user by email
      const user = await User.findOne({email});
      if (!user) {
        return res.status(401).json({
          message : "User not found, check the credentials",
          error : console.error("Error at RefreshToken function in userController!")
        });
      };

      //Comparing the refreshToken.
      if (user.refreshToken !== refreshToken) {
        return res.status(401).json({
          message : "Refresh token does not match with our records."
        });
      }
     
      //Verify refreshToken signatures
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (error) {
        return res.status (401).json({
          message : "Invalid or expired refresh token!"
        });
      }

    // Generate new access token
    const newAccessToken = await user.generateAccessToken();
    user.accessToken = newAccessToken;
    await user.save();

    return res.status(200).json({
      message: "Access token refreshed",
      email : user.email,
      accessToken: newAccessToken,
    });

    } catch (error) {
      return res.status(401).json({
        message : "Expired or invalid refresh token!!"
      });
    }
};

//4. Logout User
export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "UserId required" });

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshToken = null;
    user.accessToken = null;
    await user.save();

    return res.status(200).json({ message: "Logout successful" });

  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal error" });
  }
};
