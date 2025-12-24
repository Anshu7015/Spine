import e from "express";
import { demoFunction } from "../controllers/demoController.js"; 

const router = e.Router();

router.post("/post",demoFunction);

export default router;