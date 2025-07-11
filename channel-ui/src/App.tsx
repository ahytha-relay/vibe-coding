import { useEffect, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Message from './components/Message'
import type { ChannelMessage } from './services/channel'

function App() {
  // channel is identified through the URL
  const channelId = window.location.pathname.split('/').pop() ?? '';
  const theme = createTheme();
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {messages.map(message => (
        <Message key={message.id} channelId={channelId} messageId={message.id} />
      ))}
    </ThemeProvider>
  )
}

export default App
