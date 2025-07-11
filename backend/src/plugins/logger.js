const fp = require('fastify-plugin');
const pino = require('pino');

module.exports = fp(function (fastify, opts, done) {
  const logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  });
  fastify.decorate('logger', logger);
  done();
});
