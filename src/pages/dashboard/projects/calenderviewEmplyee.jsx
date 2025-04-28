import React from 'react';

import { Box, Modal, Typography } from '@mui/material';

import CalendarGrid from './calendergrid';

const AttendanceCalendarModal = ({ open, onClose, logs }) => (
 
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: '95%',
          maxWidth: 1200,
          height: '90%',
          mx: 'auto',
          my: 4,
          bgcolor: 'background.paper',
          p: 4,
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" mb={3}>
          Attendance Calendar
        </Typography>
        <CalendarGrid logs={logs} />
      </Box>
    </Modal>
)

export default AttendanceCalendarModal;
