const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { parseSongFromDB } = require('../../utils/index');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration = 0, albumId = '',
  }) {
    const id = `song-${nanoid(16)}`;
    const result = await this._pool.query({
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    });
    if (result.rows[0].id !== id) {
      throw new InvariantError('Fail to create song');
    }
    return id;
  }

  async getSongs(filter = {}) {
    const { title = '', performer = '' } = filter;
    const result = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    });

    return result.rows;
  }

  async getSongsByAlbumId(albumId) {
    const result = await this._pool.query({
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    });

    return result.rows;
  }

  async getSongById(id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Song not found.');
    }

    return parseSongFromDB(result.rows[0]);
  }

  async editSongById(id, {
    title, year, genre, performer, duration = 0, albumId = '',
  }) {
    const result = await this._pool.query({
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Song not found.');
    }
  }

  async deleteSongById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Song not found.');
    }
  }
}

module.exports = SongsService;
