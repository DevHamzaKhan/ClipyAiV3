import React from 'react';
import { Modal, Typography, Box, Button, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, // Adjust width to make it thinner
  height: 350, // Adjust height to make it shorter
  bgcolor: '#333', // Dark background color
  color: '#fff', // White text color
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const LinkModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" id="modal-title" component="h2">
          Add YouTube Link
        </Typography>
        {/* Replace this with your form content */}
        <form onSubmit={onSubmit}>
          <Typography id="modal-description" sx={{ mt: 2 }}>
          <TextField
            required
            id="dataName"
            label="Data Name"
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            required
            id="dataValue"
            label="Data Value"
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={onClose} variant="outlined" style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </div>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
};

export default LinkModal;