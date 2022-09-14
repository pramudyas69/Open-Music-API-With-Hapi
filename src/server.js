/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./service/postgres/albums/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongsService = require('./service/postgres/songs/SongsService');
const SongsValidator = require('./validator/songs');

// error
const ClientError = require('./exceptions/ClientError');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/authentications/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications/index');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./service/postgres/playlists/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists/index');

// users
const users = require('./api/users');
const UsersService = require('./service/postgres/users/UsersService');
const UsersValidator = require('./validator/users/index');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./service/postgres/collaborations/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations/index');

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
  const albumsService = new AlbumsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  await server.register([{
    plugin: Jwt,
  }]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
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
