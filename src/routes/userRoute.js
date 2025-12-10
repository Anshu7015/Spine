import express from "express";
import { registerUser, loginUser, verifyUser, refreshAccessToken, logoutUser } from "../controllers/userController.js";

const router = express.Router();

//"localhost/api/users/"

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyUser", verifyUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;