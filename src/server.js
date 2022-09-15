/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable import/extensions */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
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

// exports
const _exports = require('./api/exports');
const ProducerService = require('./service/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports/index');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./service/storage/StorageService');
const UploadsValidator = require('./validator/uploads/index');

// likes
const likes = require('./api/likes');
const LikesService = require('./service/postgres/likes/LikesService');

// cache
const CacheService = require('./service/redis/CacheService');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const cacheService = new CacheService();
  const likesService = new LikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
    plugin: Jwt,
  },
  {
    plugin: Inert,
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
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: likes,
      options: {
        service: likesService,
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
