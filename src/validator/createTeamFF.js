import Joi from "joi";

export const registerTeamFreeFire = Joi.object({
  userUID: Joi.string.required(),
  phone: Joi.string().trim().min(9).max(11).required(),
  yourUID : Joi.string().trim().min(4).max(11).required(),
  teamName : Joi.string().trim().min(3).required(),
  player1 :Joi.string().required(),
  player2 : Joi.string().required(),
  player3 : Joi.string().required(),
  player4 : Joi.string().required(),
});