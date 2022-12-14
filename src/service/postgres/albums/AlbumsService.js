const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../../exceptions/NotFoundError');
const InvariantError = require('../../../exceptions/InvariantError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const result = await this._pool.query({
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    });

    if (result.rows[0].id !== id) {
      throw new InvariantError('Invalid request body');
    }

    return id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id=$1',
      values: [id],
    };

    const result = await this._pool.query(query);

    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id =$1',
      values: [id],
    };

    const songResult = await this._pool.query(songQuery);

    if (!result.rows.length) {
      throw new NotFoundError(`Album dengan id ${id} tidak ditemukan.`);
    }

    const album = result.rows[0];
    const songs = songResult.rows;

    return {
      ...album,
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const result = await this._pool.query({
      text: 'UPDATE albums SET name = $2, year = $3 WHERE id = $1 RETURNING id',
      values: [id, name, year],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album not found.');
    }
  }

  async deleteAlbumById(id) {
    const result = await this._pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album not found.');
    }
  }
}

module.exports = AlbumsService;
