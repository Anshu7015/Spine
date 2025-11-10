import User from "../models/userModel.js"; // adjust path as needed
import { createUserValidator } from "../validator/userValidator.js"; 

// 1. Register User, POST Method (It will register the user to the DB.)
export const registerUser = async (req, res) => {
  try {
    // Validate input using Joi
    const { error, value } = createUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      userName,
      userPassword,
      email,
      contact,
      matchPlayed,
      matchWon,
      tokenCoins,
      isEmailVerified,
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
      userPassword,
      email,
      contact,
      matchPlayed,
      matchWon,
      tokenCoins,
      isEmailVerified,
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
        message: "Please provide both email and password.",
      });
    }

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

    // Check if user is banned or suspended
    if (user.status === "banned") {
      return res.status(403).json({
        message: "Your account has been banned. Please contact support.",
      });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Try again later.",
      });
    }

    // If login successful and email not verified, trigger OTP process
    if (!user.isEmailVerified) {
      return res.status(200).json({
        message: "Login successful. Please verify your email via OTP.",
        userId: user._id, // send this for OTP verification step
        otpRequired: true,
      });
    }

    // If already verified
    return res.status(200).json({
      message: "Login successful.",
      user: {
        userName: user.userName,
        email: user.email,
        userId: user.userId,
        contact: user.contact,
        matchPlayed: user.matchPlayed,
        matchWon: user.matchWon,
        tokenCoins: user.tokenCoins,
        status: user.status,
        image: user.image,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

