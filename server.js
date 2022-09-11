require('dotenv').config();
const Hapi = require('@hapi/hapi');

const albums = require('./src/api/albums');
const songs = require('./src/api/songs');
const ClientError = require('./src/exceptions/ClientError');
const AlbumsService = require('./src/service/postgres/AlbumsService');
const SongsService = require('./src/service/postgres/SongsService');
const AlbumsValidator = require('./src/validator/albums');
const SongsValidator = require('./src/validator/songs');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const songsService = new SongsService();
  const albumsService = new AlbumsService(songsService);

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    // Handle the client error
    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    // Handle the server error
    if (response.isServer) {
      console.error(`${response.name}: ${response.message}\n${response.stack}\n`);
      return h.response({
        status: 'error',
        message: 'Something went wrong in our server.',
      }).code(500);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running o port ${server.info.uri}`);
};

init();
