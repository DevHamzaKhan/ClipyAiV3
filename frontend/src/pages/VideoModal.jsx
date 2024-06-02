import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  const hours = date.getUTCHours().toString().padStart(2, '0'); // Extract hours
  const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Extract minutes
  const seconds = date.getUTCSeconds().toString().padStart(2, '0'); // Extract seconds
  return `${hours}:${minutes}:${seconds}`; // Format the timestamp
};

const VideoModal = ({ open, handleClose, url, timestamp }) => {
  const formattedTimestamp = formatTimestamp(timestamp); // Format the timestamp
  const videoUrl = `${url}?start=${formattedTimestamp}`; // Construct the video URL with formatted timestamp
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Video Modal
        </Typography>
        <iframe src={videoUrl} width="560" height="315" allowFullScreen title="Video"></iframe>
      </Box>
    </Modal>
  );
};

export default VideoModal;
