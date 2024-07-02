const Joi = require("joi");
const passwordSchema = Joi.string()
.min(8)
.max(30)
.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$'))
.required()
.messages({
  'string.pattern.base': 'Password must be between 8-30 characters long, include at least one    uppercase letter, one lowercase letter, one number, and one special character.',
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

const userUpdateProfileSchema = Joi.object({
  name: Joi.string().required(),
  dob:Joi.string().required(),
  email: Joi.string().required(),
})

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
  type: Joi.string().valid("free", "paid").default("free").messages({
    'any.only': 'type must be one of [free, paid]'
  })
})


const addClassSchema =Joi.object({
  courseId: Joi.string().required(),
  classNo:Joi.number().required(),
  className:Joi.string().required(),
  description:Joi.number().required(),
  classyoutubelink: Joi.string().required(),
  description: Joi.string().required(),
  videoWatchTime:Joi.string().required()
})


const ratingSchema =Joi.object({
  courseId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().optional()
})
const fabricStore=Joi.object({
   name:Joi.string().required(),
   title:Joi.string().required(),
   totalPrice:Joi.number().required(),
   discount:Joi.number().required(),
   
})

const upadteRatingSchema =Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().optional()
})

const otpSchema = Joi.object()
  .keys({
    details: Joi.string().required(),
    otp: Joi.number().max(999999).required(),
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
  })
  .required();

const phoneSchema = Joi.object()
  .keys({
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required(),
  })
  .required();

  const bannerSchema=Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.string(),
 })  

module.exports={
registrationUserSchema,
userLoginSchema,
registrationAdminUserSchema,
adminUserLoginSchema,
addCouresSchema,
addClassSchema,
ratingSchema,
upadteRatingSchema,
phoneSchema,
otpSchema,
userUpdateProfileSchema,
fabricStore,
bannerSchema
}