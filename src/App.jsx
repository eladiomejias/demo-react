import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NoteDialog from './components/NoteDialog';
import NoteList from './components/NoteList';
import DecryptDialog from './components/DecryptDialog';
import CryptoJS from 'crypto-js';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function encryptText(text, secretKey) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decryptText(encrypted, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function App() {
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [openDecryptDialog, setOpenDecryptDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [decryptAction, setDecryptAction] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSave = (title, content, secret) => {
    const encryptedContent = encryptText(content, secret);
    const id = editNote ? editNote.id : crypto.randomUUID();
    const newNote = { id, title, content: encryptedContent, decryptedContent: '' };
    const updatedNotes = editNote
      ? notes.map(note => (note.id === id ? newNote : note))
      : [...notes, newNote];
    setNotes(updatedNotes);
    setOpenDialog(false);
    setEditNote(null);
  };

  const handleDecrypt = (note, secret) => {
    try {
      const decryptedContent = decryptText(note.content, secret);
      setNotes(notes.map(n => n.id === note.id ? { ...n, decryptedContent } : n));
    } catch (error) {
      alert('Llave secreta incorrecta');
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setDecryptAction('edit');
    setOpenDecryptDialog(true);
  };

  const handleDelete = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };

  const handleDecryptDialogClose = () => {
    setOpenDecryptDialog(false);
    setSelectedNote(null);
    setDecryptAction(null);
  };

  const handleDecryptDialogSubmit = (secret) => {
    if (decryptAction === 'edit' && selectedNote) {
      try {
        const decryptedContent = decryptText(selectedNote.content, secret);
        setEditNote({ ...selectedNote, decryptedContent });
        setOpenDialog(true);
      } catch (error) {
        alert('Llave secreta incorrecta');
      }
    }
    handleDecryptDialogClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Noties</Typography>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <NoteList notes={notes} onDecrypt={handleDecrypt} onEdit={handleEdit} onDelete={handleDelete} />
        <Fab color="primary" aria-label="add" onClick={() => setOpenDialog(true)} style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
          <AddIcon />
        </Fab>
        <NoteDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSave}
          note={editNote}
        />
        <DecryptDialog
          open={openDecryptDialog}
          onClose={handleDecryptDialogClose}
          onDecrypt={handleDecryptDialogSubmit}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;