import Joi from 'joi';

export const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
});

export const addUser = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const editUser = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().optional(),
});
