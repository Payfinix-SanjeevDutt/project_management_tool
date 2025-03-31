import dayjs from 'dayjs';
import React, { useState, useContext } from 'react';

import { DatePicker } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import {
    Box,
    Paper,
    Select,
    MenuItem,
    TextField,
    Typography,
    IconButton,
    FormControl,
} from '@mui/material';

import { AuthContext } from 'src/auth/context/auth-context';

const dummyData = [
    {
        id: 1,
        employee: 'John Doe',
        jobName: 'Frontend Developer',
        projectName: 'Project X',
        clientName: 'Client Y',
    },
    {
        id: 2,
        employee: 'Jane Smith',
        jobName: 'Backend Developer',
        projectName: 'Project Y',
        clientName: 'Client Z',
    },
    {
        id: 3,
        employee: 'John Doe',
        jobName: 'Backend Developer',
        projectName: 'Project X',
        clientName: 'Client Z',
    },
];

const TimeData = () => {
    const [rows] = useState(dummyData);
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('week'));
    const [viewMode, setViewMode] = useState('weekly');
    const { user } = useContext(AuthContext);
    const [filters, setFilters] = useState({
        employee: '',
        jobName: '',
        projectName: '',
        clientName: '',
        date: null,
    });

    const getDates = () => {
        if (viewMode === 'weekly') {
            return Array.from({ length: 7 }, (_, i) =>
                dayjs(selectedDate).add(i, 'day').format('MMM DD ddd')
            );
        }
        const daysInMonth = dayjs(selectedDate).daysInMonth();
        return Array.from({ length: daysInMonth }, (_, i) =>
            dayjs(selectedDate)
                .date(i + 1)
                .format('MMM DD ddd')
        );
    };

    const changePeriod = (offset) => {
        setSelectedDate((prevDate) =>
            viewMode === 'weekly'
                ? prevDate.add(offset, 'week').startOf('week')
                : prevDate.add(offset, 'month').startOf('month')
        );
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleDateChange = (newDate) => {
        setFilters((prevFilters) => ({ ...prevFilters, date: newDate }));
    };

    const filteredRows = rows.filter(
        (row) =>
            (filters.employee === '' || row.employee === filters.employee) &&
            (filters.jobName === '' || row.jobName === filters.jobName) &&
            (filters.projectName === '' || row.projectName === filters.projectName) &&
            (filters.clientName === '' || row.clientName === filters.clientName) &&
            (!filters.date ||
                dayjs(filters.date).format('MMM DD, YYYY') ===
                    dayjs(selectedDate).format('MMM DD, YYYY'))
    );

    const columns = [
        { field: 'employee', headerName: 'Employee', width: 200 },
        { field: 'clientName', headerName: 'Client Name', width: 200 },
        { field: 'projectName', headerName: 'Project Name', width: 200 },
        { field: 'jobName', headerName: 'Job Name', width: 200 },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
            renderCell: () => 'Worked on project tasks.',
        },
        ...getDates().map((day, index) => ({
            field: `day${index}`,
            headerName: day,
            width: 100,
            renderCell: () => (
                <TextField
                    variant="outlined"
                    size="small"
                    defaultValue="08:00"
                    sx={{ width: 80 }}
                />
            ),
        })),
        { field: 'total', headerName: 'Total', width: 100, renderCell: () => '40:00' },
    ];

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
                <IconButton onClick={() => changePeriod(-1)}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">
                    {viewMode === 'weekly'
                        ? `${selectedDate.format('MMM DD, YYYY')} - ${selectedDate.add(6, 'day').format('MMM DD, YYYY')}`
                        : selectedDate.format('MMMM YYYY')}
                </Typography>
                <IconButton onClick={() => changePeriod(1)}>
                    <ArrowForward />
                </IconButton>
            </Box>

            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <FormControl>
                    <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                </FormControl>
                {['employee', 'jobName', 'projectName', 'clientName'].map((filterKey) => (
                    <FormControl key={filterKey} sx={{ minWidth: 150 }}>
                        <Select
                            name={filterKey}
                            value={filters[filterKey]}
                            onChange={handleFilterChange}
                            displayEmpty
                        >
                            <MenuItem value="">
                                All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                            </MenuItem>
                            {[...new Set(dummyData.map((item) => item[filterKey]))].map(
                                (option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                ))}
                <DatePicker
                    label="Select Date"
                    value={filters.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>

            <Paper sx={{ mt: 3, borderRadius: 2, height: 350, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={4}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Paper>
        </Box>
    );
};

export default TimeData;
