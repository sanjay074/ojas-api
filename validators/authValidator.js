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
  userName: Joi.string().required(),
  email: Joi.string().required(),
  password: passwordSchema,
});

const userUpdateProfileSchema = Joi.object({
  name: Joi.string().required(),
  dob: Joi.string().required(),
  email: Joi.string().required(),
  agree: Joi.boolean(),
  gender: Joi.string().valid('Male', 'Female').messages({
    'any.only': 'Gender must be either Male or Female.',
    'any.required': 'Gender is required.',
  }),
})

const userLoginSchema = Joi.object({
  userName: Joi.string(),
  email: Joi.string(),
  password: passwordSchema,
})



const registrationAdminUserSchema = Joi.object({
  email: Joi.string().required(),
  userName: Joi.string(),
  password: passwordSchema,
});


const adminUserLoginSchema = Joi.object({
  email: Joi.string(),
  password: passwordSchema,
})

const addCouresSchema = Joi.object({
  couresName: Joi.string().required(),
  discount: Joi.number().required(),
  totalPrice: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("free", "paid").default("free").messages({
    'any.only': 'type must be one of [free, paid]'
  })
})


const addClassSchema = Joi.object({
  courseId: Joi.string().required(),
  classNo: Joi.number().required(),
  className: Joi.string().required(),
  description: Joi.number().required(),
  classyoutubelink: Joi.string().required(),
  description: Joi.string().required(),
  videoWatchTime: Joi.string().required()
})


const ratingSchema = Joi.object({
  courseId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().optional()
})

const fabricStore = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().required(),
  totalPrice: Joi.number().required(),
  discount: Joi.number().required(),

})

const upadteRatingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  review: Joi.string().optional()
})

const otpSchema = Joi.object()
  .keys({
    details: Joi.string()
      .required()
      .messages({
        'any.required': 'Details are required.',
        'string.base': 'Details must be a string.',
      }),
    otp: Joi.number()
      .max(999999)
      .required()
      .messages({
        'any.required': 'OTP is required.',
        'number.base': 'OTP must be a number.',
        'number.max': 'OTP must be a 6-digit number.',
      }),
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required()
      .messages({
        'any.required': 'Phone number is required.',
        'string.pattern.base': 'Phone number must be a valid 10-digit number starting with 6-9.',
      }),
  })
  .required();

const phoneSchema = Joi.object()
  .keys({
    phone: Joi.string()
      .regex(/^[6-9]{1}[0-9]{9}$/)
      .required()
      .messages({
        'any.required': 'Phone number is required.',
        'string.pattern.base': 'Phone number must be a valid 10-digit number starting with 6-9.',
      }),
  })
  .required()

const bannerSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string(),
})

const userAddressJoiSchema = Joi.object({
  fullName: Joi.string().required().messages({
    'any.required': 'Full name is required.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  mobileNumber: Joi.string().required().messages({
    'any.required': 'Mobile number is required.',
  }),
  deliveryAddress: Joi.object({
    state: Joi.string().required().messages({
      'any.required': 'State is required.',
    }),
    distrct: Joi.string().required().messages({
      'any.required': 'District is required.',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required.',
    }),
    pinCode: Joi.number().required().messages({
      'any.required': 'Pin code is required.',
      'number.base': 'Pin code must be a number.',
    }),
    houseNo: Joi.number().optional(),
    fullAddress:Joi.string().required().messages({
      'any.required': 'fullAddress is required.',
    }),
    landmark:Joi.string().required().messages({
      'any.required': 'landmark is required.',
    }),
    addressType: Joi.string().valid('Home', 'Work').messages({
      'any.only': 'Address type must be either Home or Work.',
      'any.required': 'Address type is required.',
    }),
  }).required(),
});

const updateUserAddressJoiSchema = Joi.object({
  fullName: Joi.string().required().messages({
    'any.required': 'Full name is required.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  mobileNumber: Joi.string().required().messages({
    'any.required': 'Mobile number is required.',
  }),
  deliveryAddress: Joi.object({
    state: Joi.string().required().messages({
      'any.required': 'State is required.',
    }),
    distrct: Joi.string().required().messages({
      'any.required': 'District is required.',
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required.',
    }),
    pinCode: Joi.number().required().messages({
      'any.required': 'Pin code is required.',
      'number.base': 'Pin code must be a number.',
    }),
    houseNo: Joi.number().optional(),
    fullAddress:Joi.string().required().messages({
      'any.required': 'fullAddress is required.',
    }),
    landmark:Joi.string().required().messages({
      'any.required': 'landmark is required.',
    }),
    addressType: Joi.string().valid('Home', 'Work').messages({
      'any.only': 'Address type must be either Home or Work.',
      'any.required': 'Address type is required.',
    }),
  }).required(),
});

const couponValidationSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': 'Coupon code is required',
    'any.required': 'Coupon code is required'
  }),
  discountType: Joi.string().valid('percentage', 'amount').required().messages({
    'any.only': 'Discount type must be either percentage or amount',
    'any.required': 'Discount type is required'
  }),
  discountValue: Joi.number().required().messages({
    'number.base': 'Discount value must be a number',
    'any.required': 'Discount value is required'
  }),
  expirationDate: Joi.date().required().messages({
    'date.base': 'Expiration date must be a valid date',
    'any.required': 'Expiration date is required'
  })
});





const orderSchema = Joi.object({
  // userId: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/)
  //   .required()
  //   .messages({
  //     'string.base': 'User ID should be a string',
  //     'string.pattern.base': 'User ID should be a valid MongoDB ObjectId',
  //     'any.required': 'User ID is required',
  //   }),
  userAddress: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.base': 'User Address id should be a string',
      'string.pattern.base': 'User ID should be a valid MongoDB ObjectId',
      'any.required': 'User Address id is required',
    }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.base': 'Product ID should be a string',
            'string.pattern.base': 'Product ID should be a valid MongoDB ObjectId',
            'any.required': 'Product ID is required',
          }),
        quantity: Joi.number()
          .min(1)
          .required()
          .messages({
            'number.base': 'Quantity should be a number',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required',
          })
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Products should be an array',
      'array.min': 'At least one product is required',
      'any.required': 'Products are required',
    })
});



module.exports = {
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
  bannerSchema,
  userAddressJoiSchema,
  updateUserAddressJoiSchema,
  couponValidationSchema,
  orderSchema
}