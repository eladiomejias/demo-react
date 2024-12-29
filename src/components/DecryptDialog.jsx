import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DecryptDialog({ open, onClose, onDecrypt }) {
  const [secret, setSecret] = useState('');

  const handleDecrypt = () => {
    onDecrypt(secret);
    setSecret('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Introduce la llave secreta
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            autoFocus
            margin="dense"
            label="Llave Secreta"
            type="password"
            fullWidth
            variant="outlined"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleDecrypt} color="primary" variant="contained">
          Desencriptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DecryptDialog;