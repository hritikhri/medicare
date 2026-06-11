const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  mobile: Joi.string().required(),
  role: Joi.string().valid('patient', 'doctor')
});

module.exports = { registerSchema }; // Add more schemas as needed