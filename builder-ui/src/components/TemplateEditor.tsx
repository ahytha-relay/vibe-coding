import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import type { ChannelTemplate } from '../services/template';
import { createTemplate, updateTemplate, deleteTemplate } from '../services/template';

interface TemplateEditorProps {
  templates: ChannelTemplate[];
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ChannelTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bannerImage: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSelectTemplate = (template: ChannelTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCreateNew = () => {
    setFormData({ name: '', bannerImage: '' });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedTemplate) {
      setFormData({
        name: selectedTemplate.name,
        bannerImage: selectedTemplate.bannerImage
      });
      setIsEditMode(true);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    if (selectedTemplate) {
      try {
        await deleteTemplate(selectedTemplate.id);
        setSelectedTemplate(null);
        // Would need to refresh templates here in a real implementation
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedTemplate) {
        await updateTemplate(selectedTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      setIsDialogOpen(false);
      // Would need to refresh templates here in a real implementation
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Channel Templates
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateNew}
                sx={{ mb: 2 }}
              >
                Create New Template
              </Button>
              <List>
                {templates.map((template: ChannelTemplate) => (
                  <ListItem 
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: selectedTemplate?.id === template.id ? 'action.selected' : 'transparent'
                    }}
                  >
                    <ListItemText primary={template.name} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '67%' } }}>
          {selectedTemplate ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Template Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Name:</Typography>
                  <Typography>{selectedTemplate.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">Banner Image:</Typography>
                  <img 
                    src={selectedTemplate.bannerImage} 
                    alt="Banner" 
                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1">
                  Select a template from the list or create a new one.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Template Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <TextField
            margin="dense"
            name="bannerImage"
            label="Banner Image URL"
            fullWidth
            variant="outlined"
            value={formData.bannerImage}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateEditor;
