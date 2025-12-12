import express from "express";
import { cardCreation, getCardsFreeFire } from "../controllers/cardFreefireController.js";

const router = express.Router();

router.post("/create",cardCreation);
router.get("/getCards", getCardsFreeFire);

export default router;