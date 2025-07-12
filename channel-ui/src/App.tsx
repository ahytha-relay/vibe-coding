import { useEffect, useState } from 'react'
import { Box, Container, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material'
import './App.css'
import Message from './components/Message'
import type { Channel, ChannelMessage } from './services/channel'
import { getChannel, getChannelMessages } from './services/channel'

function App() {
  // channel is identified through the URL
  const channelId = window.location.pathname.split('/').pop() ?? '';
  const theme = createTheme({
    palette: {
      background: {
        default: '#f5f5f5', // light gray
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          'html, body': {
            margin: 0,
            padding: 0,
            height: '100%',
          },
          '#root': {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }
        }
      }
    }
  });
  const [messages, setMessages] = useState([] as ChannelMessage[]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fetch channel and messages
  useEffect(() => {
    async function fetchChannelData() {
      if (!channelId) return;
      
      try {
        setLoading(true);
        // Fetch channel data
        const channelData = await getChannel(channelId);
        setChannel(channelData);
        
        // Fetch messages
        const messagesData = await getChannelMessages(channelId);
        setMessages(messagesData);
      } catch (err) {
        console.error('Error fetching channel data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchChannelData();
  }, [channelId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4 }}>
          {loading ? (
            <Typography variant="h6">Loading channel...</Typography>
          ) : error ? (
            <Typography color="error">Error: {error.message}</Typography>
          ) : (
            <>
              {channel?.bannerImage || channel?.bannerImage ? (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <img 
                    src={channel.bannerImage || channel.bannerImage || ''} 
                    alt={'Channel banner'} 
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              ) : (
                <Typography variant="h4" component="h1" gutterBottom>
                  {'Channel'}
                </Typography>
              )}
              
              {messages.map(message => (
                <Message key={message.id} channelId={channelId} messageId={message.id} />
              ))}
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
