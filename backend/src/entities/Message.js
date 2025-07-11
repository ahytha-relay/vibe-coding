const { EntitySchema } = require('typeorm');
const channel = require('../routes/channel');

module.exports = new EntitySchema({
  name: 'Message',
  tableName: 'messages',
  columns: {
    id: {
      type: String,
      primary: true,
    },
    channelId: {
      type: String,
      nullable: false,
    },
    content: {
      type: String,
      nullable: false,
    },
  },
});
