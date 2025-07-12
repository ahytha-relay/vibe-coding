import { useEffect, useState } from 'react'
import { Box, Container, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material'
import './App.css'
import Message from './components/Message'
import type { ChannelMessage } from './services/channel'
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
  const [channel, setChannel] = useState<Awaited<ReturnType<typeof getChannel>> | null>(null);
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
      <Container maxWidth={false} disableGutters>
        <Box>
          {loading ? (
            <Box sx={{ p: 4 }}>
              <Typography variant="h6">Loading channel...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ p: 4 }}>
              <Typography color="error">Error: {error.message}</Typography>
            </Box>
          ) : (
            <>
              {channel?.channelTemplate?.bannerImage ? (
                <Box 
                  sx={{ 
                    width: '100%', 
                    bgcolor: '#333', // dark gray background
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 2
                  }}
                >
                  <img 
                    src={channel.channelTemplate?.bannerImage || ''} 
                    alt={channel.channelTemplate?.name || 'Channel banner'} 
                    style={{ maxHeight: '200px' }}
                  />
                </Box>
              ) : (
                <Typography variant="h4" component="h1" gutterBottom>
                  {channel?.channelTemplate?.name || 'Channel'}
                </Typography>
              )}
              
              <Box sx={{ px: 4, py: 2 }}>
                {messages.map(message => (
                  <Message key={message.id} channelId={channelId} messageId={message.id} />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
