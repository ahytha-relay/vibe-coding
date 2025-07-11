import { useEffect, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import Message from './components/Message'
import type { ChannelMessage } from './services/channel'

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

  // fetch list of messages for channel
  useEffect(() => {
    async function fetchMessages() {
      const channelId = window.location.pathname.split('/').pop();
      const res = await fetch(`/api/channel/${channelId}/messages`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    }
    fetchMessages();
  }, [channelId]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h1>Vite + React</h1>
      {messages.map(message => (
        <Message key={message.id} channelId={channelId} messageId={message.id} />
      ))}
    </ThemeProvider>
  )
}

export default App
