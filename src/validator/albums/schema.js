const Joi = require('joi');

const AlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required().max(9999),
});

module.exports = { AlbumSchema };
