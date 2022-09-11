const InvariantError = require('../../exceptions/InvariantError');
const { AlbumSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbum: (payload) => {
    const validationResult = AlbumSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
