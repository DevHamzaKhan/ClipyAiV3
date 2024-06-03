import React, { useState } from 'react';
import { Modal, Typography, Box, Button, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 350,
  bgcolor: '#333',
  color: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DashboardModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" id="modal-title" component="h2">
          Add Workspace
        </Typography>
        <form onSubmit={handleSubmit}>
          <div id="modal-description" style={{ marginTop: 16 }}>
            <TextField
              required
              id="title"
              label="Title"
              variant="outlined"
              margin="normal"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required
              id="description"
              label="Description"
              variant="outlined"
              margin="normal"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={onClose} variant="outlined" style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default DashboardModal;
