import express from "express";
import { managerApplying, managerLogin, managerPasswordReset } from "../controllers/managerController.js";

const router = express.Router();

//Route for manager applying
router.post("/apply", managerApplying);
router.post("/login", managerLogin);
router.post("/resetPassword", managerPasswordReset);
export default router;