import Joi from "joi";

export const registerCoinValidator = Joi.object({
    adminEmail : Joi.string().required(),
    adminPassword : Joi.string().required(),
    coinIndex : Joi.number().required(),
    coinQuantity : Joi.number().required(),
    discount : Joi.boolean(),
    discountedPrice : Joi.number(),
    price : Joi.number().required(),
    currency : Joi.string().required()
});

export const coinOrderValidator = Joi.object({
    userId : Joi.string().required(),
    orderId : Joi.string().required(),
    coinId : Joi.string().required(),
    token : Joi.string().required(),
    amount : Joi.number().required(),
    status : Joi.string().valid("successful", "unsuccessful")
});