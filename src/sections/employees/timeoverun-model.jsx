import React from 'react';

import {
  Box,
  Modal,
  Table,
  Paper,
  Button,
  Backdrop,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

const TimeOverrunModal = ({ open, handleClose, assigneeId, missedDays = [] }) => (
  <Modal
    open={open}
    onClose={handleClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '100%', sm: '85%', md: '60%' },
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
      }}
    >
      

      {!Array.isArray(missedDays) || missedDays.length === 0 ? (
        <Typography>No missed days recorded.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{minWidth:100 }}><b>Employee Name</b></TableCell>
                <TableCell align="center" sx={{minWidth:100 }}><b>Project Name</b></TableCell>
                <TableCell align="center" sx={{ minWidth: 400 }}><b>Task Name</b></TableCell>
                <TableCell align="center"sx={{minWidth:150 }}><b>Date</b></TableCell>
                <TableCell align="center"sx={{minWidth:100 }}><b>Hours Spent</b></TableCell>
                <TableCell align="center"sx={{minWidth:100 }}><b>Missed Time (hrs)</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {missedDays.map((log, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{log.employee_name || '-'}</TableCell>
                  <TableCell align="center">{log.project_name || 'Project XYZ'}</TableCell>
                  <TableCell align="center">{log.task_name || `Task-${index + 1}`}</TableCell>
                  <TableCell align="center">{log.date || '-'}</TableCell>
                  <TableCell align="center">{log.hours}</TableCell>
                  <TableCell align="center">{Math.max(0, 8 - log.hours)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default TimeOverrunModal;

