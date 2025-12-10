import Joi from "joi";

export const createFreefireCard = Joi.object({
  title: Joi.string().min(2).required().messages({
    "string.base": "Title must be a valid string.",
    "string.min": "Title must contain at least 2 characters.",
    "any.required": "Title is required.",
  }),

  subtitle: Joi.string().required().messages({
    "string.base": "Subtitle must be a valid string.",
    "any.required": "Subtitle is required.",
  }),

  cardIndex: Joi.number().required().messages({
    "number.base": "Card index must be a valid number.",
    "any.required": "Card index is required.",
  }),

  image: Joi.string().required().messages({
    "string.base": "Image must be a valid string.",
    "any.required": "Image is required.",
  }),
  
  lobbyTime : Joi.number(),

  minAge: Joi.number().min(12).messages({
    "number.base": "Minimum age must be a number.",
    "number.min": "Minimum age must be at least 12.",
  }),

  teamSize: Joi.number().messages({
    "number.base": "Team size must be a number.",
  }),

  totalSquads: Joi.number().min(2).required().messages({
    "number.base": "Total squads must be a number.",
    "number.min": "Minimum 2 squads are required.",
    "any.required": "Total squads is required.",
  }),

  rounds: Joi.number().required().messages({
    "number.base": "Rounds must be a number.",
    "any.required": "Rounds field is required.",
  }),

  prize: Joi.number().min(20).required().messages({
    "number.base": "Prize value must be a number.",
    "number.min": "Prize must be at least 20.",
    "any.required": "Prize is required.",
  }),

  gamePrizeAmount: Joi.number().required().messages({
    "number.base": "Game prize amount must be a number.",
    "any.required": "Game prize amount is required.",
  }),

  gameType: Joi.string().required().messages({
    "string.base": "Game type must be a valid string.",
    "any.required": "Game type is required.",
  }),

  game : Joi.string()
});
