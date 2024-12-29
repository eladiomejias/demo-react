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

function NoteList({ notes, onDecrypt, onEdit, onDelete }) {
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

  return (
    <Grid container spacing={2}>
      {notes.map((note) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={note.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{note.title}</Typography>
              {note.decryptedContent && (
                <Typography variant="body2" color="textSecondary">
                  {note.decryptedContent}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <IconButton onClick={() => handleOpenDecryptDialog(note)}>
                <LockOpenIcon />
              </IconButton>
              <IconButton onClick={() => onEdit(note)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(note.id)}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
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