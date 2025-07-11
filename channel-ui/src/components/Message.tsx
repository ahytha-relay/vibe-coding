import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import type { ChannelMessage } from '../services/channel';

interface MessageProps {
  channelId: string;
  messageId: string;
}

const Message: React.FC<MessageProps> = ({ channelId, messageId }) => {
  const [message, setMessage] = useState<ChannelMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all messages and find the one with the given id
        const res = await fetch(`/api/channel/${channelId}/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const messages: ChannelMessage[] = await res.json();
        const found = messages.find(m => m.id === messageId);
        if (!found) throw new Error('Message not found');
        setMessage(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchMessage();
  }, [channelId, messageId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!message) return null;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1">{message.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default Message;
