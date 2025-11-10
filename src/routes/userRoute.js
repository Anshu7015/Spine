import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// @route   POST localhost/api/users/register
// @desc    Register a new user
router.post("/register", registerUser);

// @route   POST localhost/api/users/login
// @desc    Login an existing user
router.post("/login", loginUser);

export default router;