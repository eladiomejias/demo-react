import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function NoteDialog({ open, onClose, onSave, note }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [secret, setSecret] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [importance, setImportance] = useState('normal');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.decryptedContent || '');
      setTags(note.tags || []);
      setImportance(note.importance || 'normal');
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setImportance('normal');
    }
  }, [note]);

  const handleSave = () => {
    const titleValid = title.trim().length >= 3;
    const contentValid = content.trim().split(/\s+/).length >= 3;

    setTitleError(!titleValid);
    setContentError(!contentValid);

    if (titleValid && contentValid) {
      onSave(title, content, secret, tags, importance);
      setTitle('');
      setContent('');
      setSecret('');
      setTags([]);
      setImportance('normal');
      onClose();
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{note ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(false);
          }}
          error={titleError}
          helperText={titleError && 'El título debe tener al menos 3 letras'}
        />
        <TextField
          margin="dense"
          label="Contenido"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setContentError(false);
          }}
          error={contentError}
          helperText={
            contentError && 'El contenido debe tener al menos 3 palabras'
          }
        />
        <TextField
          margin="dense"
          label="Llave Secreta"
          type="password"
          fullWidth
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Importancia</InputLabel>
          <Select
            value={importance}
            label="Importancia"
            onChange={(e) => setImportance(e.target.value)}
          >
            <MenuItem value={'importante'}>Importante</MenuItem>
            <MenuItem value={'normal'}>Normal</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <TextField
          margin="dense"
          label="Agregar Tag"
          type="text"
          fullWidth
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
          InputProps={{
            endAdornment: (
              <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                Agregar
              </Button>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NoteDialog;
