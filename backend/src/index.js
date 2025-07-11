import fs from 'fs';
import Fastify from 'fastify';
const fastify = Fastify({ logger: true });

fastify.register(import('@fastify/swagger'), {
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
fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});

fastify.register(import('./plugins/typeorm.js'));
fastify.register(import('./plugins/logger.js'));

fastify.get('/healthcheck', async (request, reply) => {
  return { status: 'ok' };
});
fastify.register(import('./routes/channel.js'), { prefix: '/channel' });

const start = async () => {
  try {
    await fastify.ready();
    const docs = fastify.swagger(); // Generate Swagger documentation
    fs.writeFileSync('src/swagger.json', JSON.stringify(docs, null, 2));
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
