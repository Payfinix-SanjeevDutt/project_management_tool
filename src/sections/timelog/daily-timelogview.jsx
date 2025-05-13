import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Grid, Avatar, MenuItem, Skeleton, TextField, Typography } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

const getStatusColor = (status) => {
    switch (status) {
        case 'Present':
            return '#16a34a';
        case 'Absent':
            return '#dc2626';
        default:
            return '#6b7280';
    }
};

const columns = [
    {
        field: 'employee_name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={params.row.employee_avatar}>
                    {params.row.employee_name?.[0] || '?'}
                </Avatar>
                <span>{params.row.employee_name}</span>
            </Box>
        ),
    },
    { field: 'location', headerName: 'Location', flex: 1, valueGetter: () => 'Bangalore' },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
            <span style={{ color: getStatusColor(params.value), fontWeight: 500 }}>
                {params.value}
            </span>
        ),
    },
    {
      field: 'clock_in',
      headerName: 'Check-In',
      flex: 1,
      renderCell: (params) => {
        const clockIn = params.value;
        const isLate = clockIn && clockIn > '10:00'; 
    
        return (
          <span style={{ color: isLate ? '#dc2626' : 'green', fontWeight: isLate ? 600 : 400 }}>
            {clockIn || '--'}
          </span>
        );
      }
    },
    {
      field: 'clock_out',
      headerName: 'Check-Out',
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontWeight: 500 }}>
          {params.value ? params.value : '--:--'}
        </span>
      )
    },
    
    {
      field: 'total_hours',
      headerName: 'Total Hours',
      flex: 1,
      renderCell: (params) => {
        const total = params.value; // Format assumed to be 'HH:mm:ss' or 'HH:mm'
        if (!total) return '--:--';
    
        const totalDuration = dayjs.duration(total);
        const minDuration = dayjs.duration({ hours: 8, minutes: 30 });
    
        const isLow = totalDuration.asMinutes() < minDuration.asMinutes();
    
        return (
          <span style={{ color: isLow ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
            {total}
          </span>
        );
      }
    },
    { field: 'shift', headerName: 'Shift', flex: 1, valueGetter: () => '10:00 AM - 6:30 PM' },
    { field: 'teams', headerName: 'Teams', flex: 1, valueGetter: () => '—' },
];

const DailyTimeLogView = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentDate, setCurrentDate] = useState(dayjs());

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.post(endpoints.timelog.daily, {
                    date: currentDate.format('YYYY-MM-DD'),
                });

                if (response.data?.status && response.data?.data?.logs) {
                    const enriched = response.data.data.logs.map((log, index) => ({
                        id: index,
                        ...log,
                        status: log.clock_in ? 'Present' : 'Absent',
                    }));
                    setLogs(enriched);
                    setFilteredLogs(enriched);
                } else {
                    setLogs([]);
                    setFilteredLogs([]);
                }
            } catch (error) {
                console.error('Error fetching time logs:', error);
                setLogs([]);
                setFilteredLogs([]);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        fetchLogs();
    }, [currentDate]);

    useEffect(() => {
        let filtered = logs;

        if (statusFilter !== 'All') {
            filtered = filtered.filter((log) => log.status === statusFilter);
        }

        if (search) {
            filtered = filtered.filter((log) =>
                log.employee_name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredLogs(filtered);
    }, [search, statusFilter, logs]);

    return (
        <Box sx={{ padding: 2, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid item xs={12} sm="auto" mb={{ xs: 2, sm: 0 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" fontWeight={600}>
                            Daily Time Logs
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            ({currentDate.format('YYYY-MM-DD')})
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm="auto">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <DatePicker
                                label="Select Date"
                                value={currentDate}
                                onChange={(newValue) => setCurrentDate(newValue)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        variant: 'outlined',
                                        sx: { width: 240 },
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item>
                            <TextField
                                size="small"
                                label="Search Employee"
                                variant="outlined"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ width: 400 }}
                            />
                        </Grid>

                        <Grid item>
                            <TextField
                                select
                                size="small"
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{ width: 240 }}
                            >
                                <MenuItem value="All">All</MenuItem>
                                <MenuItem value="Present">Present</MenuItem>
                                <MenuItem value="Absent">Absent</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                {loading ? (
                    // Show Skeletons for loading state
                    Array.from({ length: 8 }).map((_, i) => (
                        <Box key={i} display="flex" gap={2} p={1}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="text" width="15%" height={24} />
                            <Skeleton variant="text" width="10%" height={24} />
                            <Skeleton variant="text" width="10%" height={24} />
                            <Skeleton variant="text" width="10%" height={24} />
                            <Skeleton variant="text" width="10%" height={24} />
                            <Skeleton variant="text" width="15%" height={24} />
                            <Skeleton variant="text" width="10%" height={24} />
                        </Box>
                    ))
                ) : (
                    <DataGrid
                        rows={filteredLogs}
                        columns={columns}
                        disableRowSelectionOnClick
                        pagination
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            boxShadow: 1,
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f3f4f6',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default DailyTimeLogView;
