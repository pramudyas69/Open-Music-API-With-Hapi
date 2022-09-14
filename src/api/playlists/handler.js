class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this);
    this.getSongsPlaylistHandler = this.getSongsPlaylistHandler.bind(this);
    this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this);
    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  async deletePlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongPlaylistHandler(request, h) {
    this._validator.validatePostSongPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifySongId(songId);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongPlaylist({
      playlistId, songId,
    });

    await this._service.addActivity(playlistId, songId, credentialId, 'add');
    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam Playlist',
    }).code(201);
  }

  async getSongsPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getSongsPlaylist({
      playlistId,
    });

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongPlaylistHandler(request) {
    this._validator.validateDeleteSongPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongPlaylist(playlistId, songId);

    await this._service.addActivity(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist',
    };
  }

  async getActivitiesHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getActivities(playlistId);

    return h.response({
      status: 'success',
      data: activities,
    });
  }
}

module.exports = PlaylistsHandler;
