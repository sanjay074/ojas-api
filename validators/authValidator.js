const Joi = require("joi");
const passwordSchema = Joi.string()
.min(8)
.max(30)
.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
.required()
.messages({
  'string.pattern.base': 'Password must be between 8-30 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  'string.min': 'Password must be at least 8 characters long.',
  'string.max': 'Password must not exceed 30 characters.',
  'any.required': 'Password is required.'
})

const registrationUserSchema = Joi.object({
  name: Joi.string().required(),
  userName:Joi.string().required(),
  email: Joi.string().required(),
  password: passwordSchema,
});

const userLoginSchema =Joi.object({
  userName:Joi.string(),
  email: Joi.string(),
  password: passwordSchema,
})



const registrationAdminUserSchema = Joi.object({
  email: Joi.string().required(),
  userName:Joi.string(),
  password: passwordSchema,
});


const adminUserLoginSchema =Joi.object({
  email: Joi.string(),
  password: passwordSchema,
})

const addCouresSchema =Joi.object({
  couresName: Joi.string().required(),
  sellPrice:Joi.number().required(),
  totalPrice:Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("free", "paid").default("free"),
})


const addClassSchema =Joi.object({
  couresId: Joi.string().required(),
  classNo:Joi.number().required(),
  description:Joi.number().required(),
  classyoutubelink: Joi.string().required(),
  description: Joi.string().required(),
  videoWatchTime:Joi.string().required()
})

module.exports={
registrationUserSchema,
userLoginSchema,
registrationAdminUserSchema,
adminUserLoginSchema,
addCouresSchema,
addClassSchema
}