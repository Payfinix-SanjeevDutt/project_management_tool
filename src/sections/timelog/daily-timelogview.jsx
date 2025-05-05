import React from 'react';

import { Phone, ViewList, ViewModule } from '@mui/icons-material';
import {
  Box, Grid, Table, Paper, Button, Avatar,
  TableRow, TableHead, TableCell, TableBody, InputBase, Typography, TableContainer
} from '@mui/material';

const teamData = [
  {
    id: 'PTPL/BLR/01',
    manager: 'Manjunath Parasuram',
    members: [
      {
        id: 'SPL/BLR/16',
        name: 'Suhas A',
        location: 'Bangalore',
        status: 'In',
        time: '10:57 AM',
        shift: '10:00 AM - 7:00 PM',
        photo: true,
      },
      {
        id: 'PTPL/BLR/12',
        name: 'Saurav Singh',
        location: 'Bangalore',
        status: 'Yet to check-in',
        shift: '10:00 AM - 7:00 PM',
        photo: true,
      },
      {
        id: 'PTPL/BLR/19',
        name: 'Sai Bharadwaj',
        location: 'Bangalore',
        status: 'In',
        time: '10:15 AM',
        outTime: '10:16 AM',
        shift: '10:00 AM - 7:00 PM',
        photo: true,
      },
    ],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'In':
      return '#16a34a'; 
    case 'Yet to check-in':
      return '#dc2626';
    default:
      return '#6b7280'; 
  }
};

const DailyTimeLogView = () => (
  <Box sx={{ padding: 2, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <Grid container justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">
        Reportees - {teamData[0].id} - {teamData[0].manager}
      </Typography>
      <Grid item display="flex" alignItems="center" gap={1}>
        <Button variant="outlined" size="small">
          <ViewModule fontSize="small" />
        </Button>
        <Button variant="outlined" size="small">
          <ViewList fontSize="small" />
        </Button>
        <InputBase
          placeholder="Search"
          sx={{
            border: '1px solid #ccc',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            width: 200,
            background: 'white',
          }}
        />
      </Grid>
    </Grid>

    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Location</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Check-In</strong></TableCell>
            <TableCell><strong>Check-Out</strong></TableCell>
            <TableCell><strong>Shift</strong></TableCell>
            <TableCell><strong>Teams</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamData[0].members.map((member, idx) => (
            <TableRow key={idx}>
              <TableCell>{member.id}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {member.photo && (
                    <Avatar sx={{ width: 24, height: 24 }}>{member.name[0]}</Avatar>
                  )}
                  <span>{member.name}</span>
                </Box>
              </TableCell>
              <TableCell>{member.location}</TableCell>
              <TableCell sx={{ color: getStatusColor(member.status), fontWeight: 500 }}>
                {member.status}
              </TableCell>
              <TableCell>{member.time || '--'}</TableCell>
              <TableCell>{member.outTime || '--'}</TableCell>
              <TableCell>{member.shift}</TableCell>
              <TableCell><Phone fontSize="small" sx={{ color: '#9ca3af' }} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default DailyTimeLogView;
