module.exports = async function (fastify, opts) {
  fastify.addSchema({
    $id: 'Channel',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the channel',
      },
      channelTemplateId: {
        type: 'string',
        format: 'uuid',
        description: 'Identifier for the channel template used to create this channel',
      },
    },
    required: ['id', 'channelTemplateId'],
  });
  fastify.addSchema({
    $id: 'ChannelMessage',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the message',
      },
      content: {
        type: 'string',
        description: 'Content of the message',
      },
    },
    required: ['id', 'content'],
  })
  const repo = () => fastify.db.getRepository('Channel');

  // Get a channel by id
  fastify.get('/:id', {
    schema: {
      description: 'Get a channel by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
        },
        required: ['id'],
      },
      response: {
        200: { $ref: 'Channel#' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const channel = await repo().findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });
    return channel;
  });

  // Create a new channel
  fastify.post('/', {
    schema: {
      description: 'Create a new channel',
      body: {
        type: 'object',
        required: ['channelTemplateId'],
        properties: {
          channelTemplateId: { type: 'string' },
        },
      },
      response: {
        201: { $ref: 'Channel#' },
      },
    }
  }, async (request, reply) => {
    const channel = repo().create(request.body);
    await repo().save(channel);
    return reply.code(201).send(channel);
  });

  // Get the messages on a channel
  fastify.get('/:id/messages', {
    schema: {
      description: 'Get all messages for a channel',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
        },
        required: ['id'],
      },
      response: {
        200: { type: 'array', items: { $ref: 'ChannelMessage#' } },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const channel = await repo().findOne({ where: { id: request.params.id }, relations: ['messages'] });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });
    return channel.messages;
  });

  // Add a message to a channel
  fastify.post('/:id/messages', {
    schema: {
      description: 'Add a message to a channel',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string' },
        },
      },
      response: {
        201: { $ref: 'ChannelMessage#' },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      },
    }
  }, async (request, reply) => {
    const channel = await repo().findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });

    const message = { ...request.body, channelId: channel.id };
    channel.messages.push(message);
    await repo().save(channel);
    return reply.code(201).send(message);
  });

  // Remove a message from a channel
  fastify.delete('/:id/messages/:messageId', {
    schema: {
      description: 'Remove a message from a channel',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
          messageId: { type: 'string', description: 'Message ID' },
        },
        required: ['id', 'messageId'],
      },
      response: {
        204: { type: 'null' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const channel = await repo().findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });

    channel.messages = channel.messages.filter(msg => msg.id !== request.params.messageId);
    await repo().save(channel);
    return reply.code(204).send();
  });

  // Delete a channel
  fastify.delete('/:id', {
    schema: {
      description: 'Delete a channel',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel ID' },
        },
        required: ['id'],
      },
      response: {
        204: { type: 'null' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const result = await repo().delete(request.params.id);
    if (result.affected === 0) return reply.code(404).send({ error: 'Channel not found' });
    return reply.code(204).send();
  });
};
