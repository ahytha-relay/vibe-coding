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
      bannerImage: {
        type: 'string',
        description: 'Banner image for the channel',
      },
    },
    required: ['id', 'channelTemplateId'],
  });
  
  fastify.addSchema({
    $id: 'ChannelTemplate',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for the channel template',
      },
      name: {
        type: 'string',
        description: 'Name of the channel template',
      },
      bannerImage: {
        type: 'string',
        description: 'URL or path to the banner image for channels created from this template',
      },
    },
    required: ['id', 'name'],
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
    const channel = await fastify.db.channels.findOne({ 
      where: { id: request.params.id },
      relations: ['channelTemplate']
    });
    
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });
    
    // Include the banner image from the template
    const result = {
      ...channel,
      bannerImage: channel.channelTemplate ? channel.channelTemplate.bannerImage : null
    };
    
    return result;
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
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    // Verify the template exists
    const template = await fastify.db.channelTemplates.findOne({ 
      where: { id: request.body.channelTemplateId }
    });
    
    if (!template) {
      return reply.code(404).send({ error: 'Channel template not found' });
    }
    
    const channel = fastify.db.channels.create(request.body);
    await fastify.db.channels.save(channel);
    
    // Include the banner image from the template in the response
    const result = {
      ...channel,
      bannerImage: template.bannerImage
    };
    
    return reply.code(201).send(result);
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
    const channel = await fastify.db.channels.findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });
    
    const messages = await fastify.db.messages.find({ where: { channelId: channel.id } });
    return messages;
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
    fastify.log.info({ body: request.body }, `Adding message to channel ${request.params.id}`);
    const channel = await fastify.db.channels.findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });

    const message = fastify.db.messages.create({ ...request.body, channelId: channel.id });
    await fastify.db.messages.save(message);
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
    const channel = await fastify.db.channels.findOne({ where: { id: request.params.id } });
    if (!channel) return reply.code(404).send({ error: 'Channel not found' });

    const message = await fastify.db.messages.findOne({ where: { id: request.params.messageId, channelId: channel.id } });
    if (!message) return reply.code(404).send({ error: 'Message not found' });
    await fastify.db.messages.remove(message);
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
    const result = await fastify.db.channels.delete(request.params.id);
    if (result.affected === 0) return reply.code(404).send({ error: 'Channel not found' });
    return reply.code(204).send();
  });

  // ChannelTemplate Routes
  
  // Get all channel templates
  fastify.get('/templates', {
    schema: {
      description: 'Get all channel templates',
      response: {
        200: { type: 'array', items: { $ref: 'ChannelTemplate#' } },
      },
    }
  }, async (request, reply) => {
    const templates = await fastify.db.channelTemplates.find();
    return templates;
  });

  // Get a channel template by id
  fastify.get('/templates/:id', {
    schema: {
      description: 'Get a channel template by ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel Template ID' },
        },
        required: ['id'],
      },
      response: {
        200: { $ref: 'ChannelTemplate#' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const template = await fastify.db.channelTemplates.findOne({ where: { id: request.params.id } });
    if (!template) return reply.code(404).send({ error: 'Channel template not found' });
    return template;
  });

  // Create a new channel template
  fastify.post('/templates', {
    schema: {
      description: 'Create a new channel template',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          bannerImage: { type: 'string' },
        },
      },
      response: {
        201: { $ref: 'ChannelTemplate#' },
      },
    }
  }, async (request, reply) => {
    const template = fastify.db.channelTemplates.create(request.body);
    await fastify.db.channelTemplates.save(template);
    return reply.code(201).send(template);
  });

  // Update a channel template
  fastify.put('/templates/:id', {
    schema: {
      description: 'Update a channel template',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel Template ID' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          bannerImage: { type: 'string' },
        },
      },
      response: {
        200: { $ref: 'ChannelTemplate#' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    const template = await fastify.db.channelTemplates.findOne({ where: { id: request.params.id } });
    if (!template) return reply.code(404).send({ error: 'Channel template not found' });
    
    fastify.db.channelTemplates.merge(template, request.body);
    await fastify.db.channelTemplates.save(template);
    return template;
  });

  // Delete a channel template
  fastify.delete('/templates/:id', {
    schema: {
      description: 'Delete a channel template',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Channel Template ID' },
        },
        required: ['id'],
      },
      response: {
        204: { type: 'null' },
        404: { type: 'object', properties: { error: { type: 'string' } } },
        409: { type: 'object', properties: { error: { type: 'string' } } },
      },
    }
  }, async (request, reply) => {
    // First check if there are any channels using this template
    const channelsUsingTemplate = await fastify.db.channels.count({ 
      where: { channelTemplateId: request.params.id } 
    });
    
    if (channelsUsingTemplate > 0) {
      return reply.code(409).send({ 
        error: `Cannot delete template: ${channelsUsingTemplate} channels are using this template` 
      });
    }
    
    const result = await fastify.db.channelTemplates.delete(request.params.id);
    if (result.affected === 0) return reply.code(404).send({ error: 'Channel template not found' });
    return reply.code(204).send();
  });
};
