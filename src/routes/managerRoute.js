import express from "express";
import { managerApplying } from "../controllers/managerController.js";

const router = express.Router();

//Route for manager applying
router.post("/apply", managerApplying);

export default router;