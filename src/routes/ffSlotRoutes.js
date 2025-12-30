import e from "express";
import { registerTeamForFreeFire, paymentConfirming_SlotMakingForUser, managerSlotShowing, managerSlotAssigning } from "../controllers/slotFreefireController.js";

const router = e.Router();

//1.Register team by the user with required details.
router.post("/registerTeam",registerTeamForFreeFire);
//2.Confirming the payment and registering user to the slot
router.post("/userPaymentConfirmingAndSlot",paymentConfirming_SlotMakingForUser)
//3.Showing manager the available slots
router.get("/availableSlotsManager",managerSlotShowing);
//4.Assigning manager to the available slots
router.post("/assignManager",managerSlotAssigning);

export default router;  