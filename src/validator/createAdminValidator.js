import Joi from "joi";

export const createAdminValidator = Joi.object({
    adminName : Joi.string().trim().min(2).max(20),
    adminEmail: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email is required",
          "string.email": "Please enter a valid email address",
        }),
    adminPassword : Joi.string().min(8).max(20).required()
});