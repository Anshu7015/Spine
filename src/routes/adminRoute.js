import express from "express";
import { createAdmin, loginAdmin, managerApproving } from "../controllers/adminController";

const router = express.Router();

//Routes for admin(web use only!!)
router.post("/createAdmin", createAdmin);
router.post("/login", loginAdmin);
router.post("/approveManager", managerApproving);

export default router;