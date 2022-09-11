const InvariantError = require('../../exceptions/InvariantError');
const { SongSchema, SongFilterQuerySchema } = require('./schema');

const SongsValidator = {
  validateSong: (payload) => {
    const validationResult = SongSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongFilterQuery: (query) => {
    const validationResult = SongFilterQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
