import express from "express";
import { cardCreation, getCardsMlbb } from "../controllers/cardMlbbController.js";

const router = express.Router();

router.post("/create",cardCreation);
router.get("/getCards", getCardsMlbb);

export default router;