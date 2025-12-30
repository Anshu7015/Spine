import e from "express";
import { registerTeamForFreeFire, paymentConfirming_SlotMakingForUser, managerSlotShowing, managerSlotAssigning } from "../controllers/slotFreefireController";

const router = e.Router();

router.post("/registerTeam",registerTeamForFreeFire);
router.post("/paymentConfirmingAndSlotAssigningToUser",paymentConfirming_SlotMakingForUser)
router.post("/availableSlotsManager",managerSlotShowing);
router.post("/AssignManager",managerSlotAssigning);

export default router;  