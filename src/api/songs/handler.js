class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSong(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    return h.response({
      status: 'success',
      data: { songId },
    }).code(201);
  }

  async getSongsHandler(request, h) {
    this._validator.validateSongFilterQuery(request.query);

    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });

    return h.response({
      status: 'success',
      data: { songs },
    });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return h.response({
      status: 'success',
      data: { song },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSong(request.payload);

    const { id } = request.params;
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    await this._service.editSongById(id, {
      title, year, genre, performer, duration, albumId,
    });

    return h.response({
      status: 'success',
      message: 'Song updated successfully.',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return h.response({
      status: 'success',
      message: 'Song deleted successfully.',
    });
  }
}

module.exports = SongsHandler;
