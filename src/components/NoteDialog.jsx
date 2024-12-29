import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function NoteDialog({ open, onClose, onSave, note }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.decryptedContent || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    onSave(title, content, secret);
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Contenido"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Llave Secreta"
          type="password"
          fullWidth
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
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