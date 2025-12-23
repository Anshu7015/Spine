import express from "express";
import { managerApplying, managerLogin } from "../controllers/managerController.js";

const router = express.Router();

//Route for manager applying
router.post("/freefireApply", managerApplying);
router.post("/freefireLogin", managerLogin);

export default router;
