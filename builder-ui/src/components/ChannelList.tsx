import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { getChannels } from '../services/channel';
import type { Channel } from '../services/channel';
import type { ChannelTemplate } from '../services/template';

interface ChannelListProps {
  templates: ChannelTemplate[];
}

export default function ChannelList({ templates }: ChannelListProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        const data = await getChannels();
        setChannels(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();
  }, []);

  // Helper function to find template name by ID
  const getTemplateName = (templateId: string): string => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#fff8f8', color: 'error.main', my: 2 }}>
        <Typography>{error}</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Active Channels
      </Typography>
      
      {channels.length === 0 ? (
        <Paper sx={{ p: 3, bgcolor: '#f5f5f5', my: 2 }}>
          <Typography>No active channels found. Create a channel using a template.</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {channels.map((channel) => (
            <Card key={channel.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {channel.bannerImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={channel.bannerImage}
                  alt={`Channel ${channel.id}`}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  Channel ID: {channel.id.substring(0, 8)}...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Template: {getTemplateName(channel.channelTemplateId)}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => window.open(`/channel-ui/${channel.id}`, '_blank')}
                >
                  View Channel
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
