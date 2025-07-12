// Channel service for API interaction

export interface Channel {
  id: string;
  channelTemplateId: string;
  bannerImage?: string;
}

export async function getChannels(): Promise<Channel[]> {
  const res = await fetch('/api/channel/');
  if (!res.ok) throw new Error('Failed to fetch channels');
  return res.json();
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
