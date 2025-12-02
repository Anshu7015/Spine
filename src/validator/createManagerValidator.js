import Joi from "joi";

export const createManagerValidator = Joi.object({
  managerName: Joi.string().trim().min(2).max(30).required().messages({
    "string.empty": "Managername is required",
    "string.min": "Managername must be atleast 3 characters long",
    "string.max": "Managername cannot be longer than 30 characters",
  }),
  phone: Joi.string() // Use string for phone numbers
    .pattern(/^\d{10}$/) // Hard constraint: exactly 10 digits
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be a valid 10-digit number",
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
  gameType: Joi.string().valid("freeFire", "mobileLegends").required().messages({
    "any.only":"invalid gametype selected"
  }),
});
