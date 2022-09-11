/* eslint-disable camelcase */

const parseSongFromDB = ({ album_id, ...others }) => ({
  ...others,
  albumId: album_id,
});

module.exports = { parseSongFromDB };
