import Joi from "joi";

export const createSlotValidator = Joi.object({
  roomId: Joi.string().allow(null, "").optional(), // manager may assign later
  roomPassword: Joi.string().allow(null, "").optional(),

  matchType: Joi.string()
    .valid("") // add your real match types here later
    .required(),

  manager: Joi.string().hex().length(24).required(),

  teamA: Joi.string().hex().length(24).optional().allow(null),

  teamAStatus: Joi.string().valid("paid", "pending").default("pending"),

  teamB: Joi.string().hex().length(24).optional().allow(null),

  teamBStatus: Joi.string().valid("paid", "pending").default("pending"),

  managerAssigned: Joi.boolean().default(false),

  matchStatus: Joi.string()
    .valid("pending", "ready", "running", "completed")
    .default("pending"),
});
