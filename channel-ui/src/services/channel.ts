// Channel service for API interaction

export interface ChannelTemplate {
  id: string;
  name: string;
  bannerImage?: string;
}

export interface Channel {
  id: string;
  channelTemplateId: string;
}

export interface ChannelMessage {
  id: string;
  content: string;
}

export async function getChannel(id: string): Promise<Channel & { channelTemplate: ChannelTemplate }> {
  const res = await fetch(`/api/channel/${id}`);
  if (!res.ok) throw new Error('Channel not found');
  const channel = await res.json();
  const template = await getChannelTemplate(channel.channelTemplateId);
  return { ...channel, channelTemplate: template };
}

export async function getChannelMessages(id: string): Promise<ChannelMessage[]> {
  const res = await fetch(`/api/channel/${id}/messages`);
  if (!res.ok) throw new Error('Messages not found');
  return res.json();
}

export async function getChannelTemplate(id: string): Promise<ChannelTemplate> {
  const res = await fetch(`/api/channel/templates/${id}`);
  if (!res.ok) throw new Error('Channel template not found');
  return res.json();
}