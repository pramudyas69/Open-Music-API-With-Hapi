/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'text',
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    genre: {
      type: 'text',
      notNull: true,
    },
    performer: {
      type: 'text',
      notNull: true,
    },
    duration: {
      type: 'integer',
    },
    album_id: {
      type: 'text',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
