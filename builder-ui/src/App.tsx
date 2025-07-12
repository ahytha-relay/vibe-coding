import { useState, useEffect } from 'react'
import { CssBaseline, ThemeProvider, createTheme, Box, Tabs, Tab } from '@mui/material'
import TemplateEditor from './components/TemplateEditor'
import ChannelList from './components/ChannelList'
import type { ChannelTemplate } from './services/template'
import './App.css'

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
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
  const [templates, setTemplates] = useState<ChannelTemplate[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // fetch list of templates when component mounts
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/channel/templates');
        if (!res.ok) throw new Error('Failed to fetch templates');
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <header className="app-header">
          <img src="/src/assets/react.svg" className="app-logo" alt="logo" />
          <h1>Channel Builder</h1>
        </header>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="channel management tabs">
            <Tab label="Templates" />
            <Tab label="Active Channels" />
          </Tabs>
        </Box>
        <main className="app-content">
          {activeTab === 0 ? (
            <TemplateEditor templates={templates} />
          ) : (
            <ChannelList templates={templates} />
          )}
        </main>
        <footer className="app-footer">
          © {new Date().getFullYear()} Vibes Platform
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
