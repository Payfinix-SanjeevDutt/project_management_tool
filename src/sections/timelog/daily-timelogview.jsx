import React from 'react';

import { Phone, ViewList, ViewModule } from '@mui/icons-material';
import { Card, Grid, Button, InputBase, Typography, CardContent } from '@mui/material';

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
            {
                id: 'PTPL/BLR/20',
                name: 'Aravind T',
                location: 'Bangalore',
                status: 'Yet to check-in',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'PTPL/BLR/22',
                name: 'Abhiskeh Nair',
                location: 'Bangalore',
                status: 'In',
                time: '09:58 AM',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'PTPL/BLR/23',
                name: 'Niveditha N',
                location: 'Bangalore',
                status: 'Yet to check-in',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'PTPL/BLR/24',
                name: 'Suchet Channa',
                location: 'Bangalore',
                status: 'In',
                time: '10:02 AM',
                outTime: '10:15 AM',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'PTPL/BLR/25',
                name: 'Suhasini Mangalam',
                location: 'Bangalore',
                status: 'In',
                time: '09:48 AM',
                shift: '10:00 AM - 7:00 PM',
            },
            {
                id: 'PTPL/BLR/26',
                name: 'Deepak Vuggu',
                location: 'Bangalore',
                status: 'In',
                time: '09:53 AM',
                shift: '10:00 AM - 7:00 PM',
            },
            {
                id: 'PTPL/BLR/27',
                name: 'Shreyas R',
                location: 'Bangalore',
                status: 'In',
                time: '09:49 AM',
                shift: '10:00 AM - 7:00 PM',
            },
            {
                id: 'PTPL/BLR/28',
                name: 'Ningappa Chalasani',
                location: 'Bangalore',
                status: 'In',
                time: '10:58 AM',
                shift: '10:00 AM - 7:00 PM',
            },
            {
                id: 'PTPL/BLR/29',
                name: 'Sagarika MD',
                location: 'Bangalore',
                status: 'Yet to check-in',
                shift: '10:00 AM - 7:00 PM',
            },
            {
                id: 'PTPL/BLR/30',
                name: 'Poornima S',
                location: 'Bangalore',
                status: 'In',
                time: '09:28 AM',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'SJPL/BLR/32',
                name: 'Dikshitha M',
                location: 'Bangalore',
                status: 'Yet to check-in',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
            {
                id: 'SJPL/BLR/34',
                name: 'Ajith Kumar G P',
                location: 'Bangalore',
                status: 'In',
                time: '09:24 AM',
                shift: '10:00 AM - 7:00 PM',
                photo: true,
            },
        ],
    },
];

const DailyTimeLogView = () => (
    <div style={{ padding: '1rem', background: '#f9fafb', minHeight: '100vh' }}>
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: '1rem' }}
        >
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

        <Grid container spacing={2}>
            {teamData[0].members.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index} style={{ display: 'flex' }}>
                    <Card
                        elevation={1}
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                        <CardContent
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Grid
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                    marginBottom={1}
                                >
                                    <Typography variant="body2" fontWeight="600">
                                        {member.id} - {member.name}
                                    </Typography>
                                    <Phone fontSize="small" style={{ color: '#9ca3af' }} />
                                </Grid>
                                <Typography variant="caption" color="text.secondary">
                                    {member.location}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    style={{
                                        color: member.status === 'In' ? '#16a34a' : '#dc2626',
                                    }}
                                >
                                    {member.status}
                                </Typography>
                                {member.time && (
                                    <Typography
                                        variant="caption"
                                        style={{ color: '#16a34a', display: 'block' }}
                                    >
                                        {member.time}
                                    </Typography>
                                )}
                                {member.outTime && (
                                    <Typography
                                        variant="caption"
                                        style={{ color: '#dc2626', display: 'block' }}
                                    >
                                        {member.outTime}
                                    </Typography>
                                )}
                            </div>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                style={{ marginTop: '0.75rem' }}
                            >
                                General - {member.shift}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </div>
);

export default DailyTimeLogView;
