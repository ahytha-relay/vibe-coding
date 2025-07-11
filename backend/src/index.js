const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'API Docs',
      description: 'API documentation with Swagger',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});
fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

fastify.register(require('./plugins/typeorm'));
fastify.register(require('./plugins/logger'));
fastify.register(require('./routes/channel'), { prefix: '/channel' });

fastify.get('/healthcheck', async (request, reply) => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
