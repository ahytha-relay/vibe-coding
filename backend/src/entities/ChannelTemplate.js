const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'ChannelTemplate',
  tableName: 'channel_templates',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      nullable: false,
    },
    bannerImage: {
      type: 'varchar',
      nullable: true,
    },
  },
  relations: {
    channels: {
      type: 'one-to-many',
      target: 'Channel',
      inverseSide: 'channelTemplate',
    },
  },
});
