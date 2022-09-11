const Joi = require('joi');

const SongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required().max(9999),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().min(0),
  albumId: Joi.string(),
});

const SongFilterQuerySchema = Joi.object({
  title: Joi.string(),
  performer: Joi.string(),
});

module.exports = { SongSchema, SongFilterQuerySchema };
