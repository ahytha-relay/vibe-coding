import { useState, useEffect } from 'react'
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider
} from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ChannelsIcon from '@mui/icons-material/DynamicFeed'
import TemplateEditor from './components/TemplateEditor'
import ChannelList from './components/ChannelList'
import type { ChannelTemplate } from './services/template'
import './App.css'

// Constants for the drawer width
const DRAWER_WIDTH = 240;

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
  const [activeView, setActiveView] = useState(0);

  const handleNavChange = (index: number) => {
    setActiveView(index);
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

  // Navigation items configuration
  const navItems = [
    { text: 'Templates', icon: <ListAltIcon /> },
    { text: 'Active Channels', icon: <ChannelsIcon /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container" style={{ flexDirection: 'row' }}>
        {/* Side Panel Navigation */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: 2,
            justifyContent: 'center' 
          }}>
            <img src="/src/assets/react.svg" className="app-logo" alt="logo" />
            <Box component="h3" sx={{ ml: 1 }}>Vibes</Box>
          </Box>
          <Divider />
          <List>
            {navItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={activeView === index}
                  onClick={() => handleNavChange(index)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <header className="app-header">
            <h1>Channel Builder</h1>
          </header>
          <Box className="app-content">
            {activeView === 0 ? (
              <TemplateEditor templates={templates} />
            ) : (
              <ChannelList templates={templates} />
            )}
          </Box>
          <Box 
            component="footer" 
            className="app-footer"
            sx={{ mt: 'auto' }}
          >
            © {new Date().getFullYear()} Vibes Platform
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  )
}

export default App
