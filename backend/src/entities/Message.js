const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Message',
  tableName: 'messages',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    channelId: {
      type: 'uuid',
      nullable: false,
    },
    content: {
      type: 'text',
      nullable: false,
    },
  },
  relations: {
    channel: {
      type: 'many-to-one',
      target: 'Channel',
      joinColumn: {
        name: 'channelId',
      },
      inverseSide: 'messages',
    },
  },
});
