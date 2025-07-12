// Template service for API interaction

export interface ChannelTemplate {
  id: string;
  name: string;
  bannerImage: string;
}

export async function getTemplates(): Promise<ChannelTemplate[]> {
  const res = await fetch('/api/channel/templates');
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function getTemplate(id: string): Promise<ChannelTemplate> {
  const res = await fetch(`/api/channel/templates/${id}`);
  if (!res.ok) throw new Error('Template not found');
  return res.json();
}

export async function createTemplate(template: Omit<ChannelTemplate, 'id'>): Promise<ChannelTemplate> {
  const res = await fetch('/api/channel/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
}

export async function updateTemplate(
  id: string, 
  template: Partial<Omit<ChannelTemplate, 'id'>>
): Promise<ChannelTemplate> {
  const res = await fetch(`/api/channel/templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template)
  });
  if (!res.ok) throw new Error('Failed to update template');
  return res.json();
}

export async function deleteTemplate(id: string): Promise<void> {
  const res = await fetch(`/api/channel/templates/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete template');
}
