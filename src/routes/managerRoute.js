import express from "express";
import { managerApplying, managerLogin } from "../controllers/managerController.js";

const router = express.Router();

//Route for manager applying
router.post("/apply", managerApplying);
router.post("/login", managerLogin);

export default router;
