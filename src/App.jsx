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
import { CircularProgress, Backdrop } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ErrorBoundary from './components/ErrorBoundary';

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
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      const notesWithHiddenContent = savedNotes.map((note) => ({
        ...note,
        decryptedContent: '',
      }));
      // Simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setNotes(notesWithHiddenContent);
      setIsLoading(false);
      setIsInitialized(true);
    };

    if (!isInitialized) {
      loadNotes();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes, isInitialized]);

  const handleSave = async (title, content, secret, tags, importance) => {
    setIsLoading(true);
    const now = new Date();
    const encryptedContent = encryptText(content, secret);
    const id = editNote ? editNote.id : crypto.randomUUID();
    const newNote = {
      id,
      title,
      content: encryptedContent,
      decryptedContent: '',
      tags: tags,
      importance: importance,
      createdAt: editNote ? editNote.createdAt : now,
      updatedAt: now,
    };
    const updatedNotes = editNote
      ? notes.map((note) => (note.id === id ? newNote : note))
      : [...notes, newNote];

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setNotes(updatedNotes);
    setOpenDialog(false);
    setEditNote(null);
    setIsLoading(false);
  };

  const handleDecrypt = async (note, secret) => {
    setIsLoading(true);
    try {
      const decryptedContent = decryptText(note.content, secret);
      setNotes(
        notes.map((n) =>
          n.id === note.id ? { ...n, decryptedContent, updatedAt: new Date() } : n
        )
      );
    } catch (error) {
      console.error('Decryption error:', error);
      alert('Llave secreta incorrecta');
    }
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setDecryptAction('edit');
    setOpenDecryptDialog(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    const updatedNotes = notes.filter((note) => note.id !== id);

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setNotes(updatedNotes);
    setIsLoading(false);
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
        console.error('Decryption error:', error);
        alert('Llave secreta incorrecta');
      }
    }
    handleDecryptDialogClose();
  };

  const filteredNotes = notes.filter((note) => {
    const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = note.tags
      ? note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : false;
    return titleMatch || tagMatch;
  });

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Noties
            </Typography>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Buscar notas por título o tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <NoteList
            notes={filteredNotes}
            onDecrypt={handleDecrypt}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setOpenDialog(true)}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
          >
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
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
