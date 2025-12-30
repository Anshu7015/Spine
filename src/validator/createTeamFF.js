import Joi from "joi";

const registerTeamFreeFire = Joi.object({
  userId: Joi.string().required(),
  phone: Joi.string().trim().min(9).max(11).required(),
  yourUID : Joi.string().trim().min(4).max(11).required(),
  teamName : Joi.string().trim().min(3).required(),
  player1 :Joi.string().required(),
  player2 : Joi.string().required(),
  player3 : Joi.string().required(),
  player4 : Joi.string().required(),
});

export default registerTeamFreeFire;