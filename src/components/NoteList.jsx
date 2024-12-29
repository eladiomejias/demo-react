import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DecryptDialog from './DecryptDialog';
import { Tooltip, Fade } from '@mui/material';
import { styled } from '@mui/system';

const NoteCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFF8E1',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

function NoteList({ notes, onDecrypt, onEdit, onDelete, isLoading }) {
  const [openDecryptDialog, setOpenDecryptDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleOpenDecryptDialog = (note) => {
    setSelectedNote(note);
    setOpenDecryptDialog(true);
  };

  const handleCloseDecryptDialog = () => {
    setOpenDecryptDialog(false);
    setSelectedNote(null);
  };

  const handleDecrypt = (secret) => {
    if (selectedNote) {
      onDecrypt(selectedNote, secret);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <Grid container spacing={2}>
      {notes.map((note, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={note.id}>
          <Fade in={!isLoading} timeout={{ enter: 500 + index * 100 }}>
            <NoteCard elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {note.title}
                </Typography>
                {note.decryptedContent && (
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {note.decryptedContent}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Creado: {formatDate(note.createdAt)}
                </Typography>
                <Typography variant="caption" display="block">
                  Modificado: {formatDate(note.updatedAt)}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0 }}>
                <Tooltip title="Desencriptar">
                  <IconButton onClick={() => handleOpenDecryptDialog(note)}>
                    <LockOpenIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton onClick={() => onEdit(note)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton onClick={() => onDelete(note.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </NoteCard>
          </Fade>
        </Grid>
      ))}
      <DecryptDialog
        open={openDecryptDialog}
        onClose={handleCloseDecryptDialog}
        onDecrypt={handleDecrypt}
      />
    </Grid>
  );
}

export default NoteList;
