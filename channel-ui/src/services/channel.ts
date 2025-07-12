// Channel service for API interaction

export interface ChannelTemplate {
  id: string;
  name: string;
  bannerImage?: string;
}

export interface Channel {
  id: string;
  channelTemplateId: string;
  bannerImage?: string; // Convenience property from the backend
}

export interface ChannelMessage {
  id: string;
  content: string;
}

export async function getChannel(id: string): Promise<Channel> {
  const res = await fetch(`/api/channel/${id}`);
  if (!res.ok) throw new Error('Channel not found');
  return res.json();
}

export async function createChannel(channelTemplateId: string): Promise<Channel> {
  const res = await fetch('/api/channel/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelTemplateId })
  });
  if (!res.ok) throw new Error('Failed to create channel');
  return res.json();
}

export async function deleteChannel(id: string): Promise<void> {
  const res = await fetch(`/api/channel/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete channel');
}

export async function getChannelMessages(id: string): Promise<ChannelMessage[]> {
  const res = await fetch(`/api/channel/${id}/messages`);
  if (!res.ok) throw new Error('Messages not found');
  return res.json();
}
