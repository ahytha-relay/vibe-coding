const fp = require('fastify-plugin');
const { DataSource } = require('typeorm');
const Message = require('../entities/Message');
const Channel = require('../entities/Channel');
const ChannelTemplate = require('../entities/ChannelTemplate');

async function dbConnector(fastify, options) {
  const dataSource = new DataSource({
    type: 'sqljs',
    autoSave: true,
    location: 'db.sqljs',
    synchronize: true,
    logging: false,
    entities: [Message, Channel, ChannelTemplate],
  });

  await dataSource.initialize();
  fastify.decorate('db', {
    ...dataSource,
    channels: dataSource.getRepository('Channel'),
    messages: dataSource.getRepository('Message'),
    channelTemplates: dataSource.getRepository('ChannelTemplate')
  });

  fastify.addHook('onClose', async (instance, done) => {
    await dataSource.destroy();
    done();
  });
}

module.exports = fp(dbConnector);
