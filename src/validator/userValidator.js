import Joi from "joi";

export const createUserValidator = Joi.object({
  userName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 2 characters long",
    "string.max": "Username cannot be longer than 50 characters",
  }),

  userPassword: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
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

  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Contact number is required",
      "string.pattern.base": "Contact must be a valid 10-digit number",
    }),

  matchPlayed: Joi.number().default(0),
  matchWon: Joi.number().default(0),
  tokenCoins: Joi.number().default(0),

  isEmailVerified: Joi.boolean().default(false),

});
