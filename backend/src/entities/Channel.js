const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Channel',
  tableName: 'channels',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    channelTemplateId: {
      type: 'uuid',
      nullable: false,
    },
  },
  relations: {
    channelTemplate: {
      type: 'many-to-one',
      target: 'ChannelTemplate',
      joinColumn: {
        name: 'channelTemplateId',
      },
      inverseSide: 'channels',
    },
    messages: {
      type: 'one-to-many',
      target: 'Message',
      inverseSide: 'channel',
    },
  },
});
