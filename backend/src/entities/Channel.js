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
      type: String,
    },
  },
});
