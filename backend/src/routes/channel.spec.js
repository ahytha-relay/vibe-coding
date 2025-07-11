const fastify = require('fastify');
const channelRoutes = require('./channel');

// Mock TypeORM plugin
const mockRepo = () => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn((data) => ({ ...data, id: 'mock-id' })),
  save: jest.fn(async (entity) => entity),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
});

const mockDb = {
  getRepository: jest.fn(() => mockRepo),
};

describe('Channel Routes', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    app.decorate('db', mockDb);
    app.register(channelRoutes, {prefix: '/channel'});
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/', () => {
    beforeAll(async () => {
      // Setup any required data or mocks for the tests
      mockDb.getRepository().create = jest.fn((data) => ({ ...data, id: 'test-channel-id' }));
      mockDb.getRepository().save = jest.fn(async (entity) => entity);
    });
    test('POST / creates a new channel', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/channel',
        payload: { name: 'New Channel' }
      });
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('New Channel');
      expect(body.id).toBe('test-channel-id');
      expect(mockDb.getRepository().save).toHaveBeenCalledWith({
        name: 'New Channel',
        id: 'test-channel-id'
      });
    });
  });
  describe('/:id', () => {

    beforeAll(async () => {
      mockDb.getRepository().find = jest.fn(() => [{ id: 'test-channel-id', name: 'Test Channel' }]);
      mockDb.getRepository().findOne = jest.fn(() => ({ id: 'test-channel-id', name: 'Test Channel' }));
      mockDb.getRepository().delete = jest.fn().mockResolvedValue({ affected: 1 });
    });

    test('GET /:id retrieves a channel by ID', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/channel/test-channel-id`
      });
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe('test-channel-id');
    });
    test('GET /:id returns 404 for non-existent channel', async () => {
      mockDb.getRepository().findOne.mockResolvedValue(null);
      const response = await app.inject({
        method: 'GET',
        url: `/channel/non-existent-id`
      });
      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Channel not found');
    });

    test('DELETE /:id removes a channel', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/channel/test-channel-id`
      });
      expect(response.statusCode).toBe(204);
      expect(mockDb.getRepository().delete).toHaveBeenCalledWith('test-channel-id');
    });
  });

  describe('/:id/messages', () => {
    let channelId;

    beforeAll(async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/channel',
        payload: { name: 'Channel for Messages' }
      });
      const body = JSON.parse(response.body);
      channelId = body.id;
    });
    test('GET /:id/messages retrieves messages for a channel', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/channel/${channelId}/messages`
      });
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
    });
    test('POST /:id/messages adds a message to the channel', async () => {
      const response = await app.inject({
        method: 'POST',
        url: `/channel/${channelId}/messages`,
        payload: { content: 'Hello, World!' }
      });
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.content).toBe('Hello, World!');
    });
    test('DELETE /:id/messages/:messageId removes a message from the channel', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/channel/${channelId}/messages/1`
      });
      expect(response.statusCode).toBe(204);
    });
  });
  // Add more tests for CRUD and edge cases as needed
});
