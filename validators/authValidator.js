const Joi = require("joi");
const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  .required();
const registrationUserSchema = Joi.object({
  name: Joi.string().required(),
  dob: Joi.string().required(),
  email: Joi.string().required(),
  password: passwordSchema,
});