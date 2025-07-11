const baseUrl = 'http://localhost:3000';
describe('Channel Routes', () => {
  const newChannel = { channelTemplateId: 'Test Channel' };

  // these tests need to run in sequence
  test('POST /channel creates a new channel', async () => {
    const res = await fetch(`${baseUrl}/channel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newChannel),
    });
  
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    newChannel.id = data.id; // Store the created channel ID for further tests
  });

  test('GET /channel/:id returns an existing channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${newChannel.id}`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', newChannel.id);
    expect(data).toHaveProperty('channelTemplateId', newChannel.channelTemplateId);
  });

  test('GET /channel/:id returns 404 for non-existent channel', async () => {
    const res = await fetch(`${baseUrl}/channel/nonexistent`);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Channel not found');
  });
  test('DELETE /channel/:id deletes an existing channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${newChannel.id}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(204); // No content on successful delete
  });
  test('DELETE /channel/:id returns 404 for already deleted channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${newChannel.id}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Channel not found');
  });
});

describe('Channel Message Routes', () => {
  let channelId; // Replace with a valid channel ID for your test
  const newMessage = { content: 'Test message' };
  beforeAll(async () => {
    const res = await fetch(`${baseUrl}/channel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelTemplateId: 'Test Channel' }),
    });
    const data = await res.json();
    channelId = data.id;
  });

  test('POST /channel/:id/messages adds a message to a channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('content', newMessage.content);
    newMessage.id = data.id; // Store the created message ID for further tests
  });

  test('GET /channel/:id/messages returns messages for a channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${channelId}/messages`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
  test('DELETE /channel/:id/messages/:messageId removes a message from a channel', async () => {
    const res = await fetch(`${baseUrl}/channel/${channelId}/messages/${newMessage.id}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(204); // No content on successful delete
    const getres = await fetch(`${baseUrl}/channel/${channelId}/messages`);
    expect(getres.status).toBe(200);
    const data = await getres.json();
    console.dir(data);
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(msg => msg.id === newMessage.id)).toBe(false); // Ensure the message was deleted
  });

  test('DELETE /channel/:id/messages/:messageId returns 404 for non-existent message', async () => {
    const messageId = 'nonexistent';
    const res = await fetch(`${baseUrl}/channel/${channelId}/messages/${messageId}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty('error', 'Message not found');
  });
});