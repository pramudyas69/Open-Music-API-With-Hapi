/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'text',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    cover_url: {
      type: 'TEXT',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
