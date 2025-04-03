import dayjs from 'dayjs';
import React, { useState, useContext } from 'react';

import { DatePicker } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import { Search, ArrowBack, ArrowForward } from '@mui/icons-material';
import {
    Box,
    Paper,
    Select,
    MenuItem,
    TextField,
    Typography,
    IconButton,
    FormControl,
    InputAdornment,
} from '@mui/material';

import { AuthContext } from 'src/auth/context/auth-context';

const dummyData = [
    { id: 1, employee: 'John Doe', jobName: 'Frontend Developer', projectName: 'Project X', clientName: 'Client Y' },
    { id: 2, employee: 'Jane Smith', jobName: 'Backend Developer', projectName: 'Project Y', clientName: 'Client Z' },
    { id: 3, employee: 'John Doe', jobName: 'Backend Developer', projectName: 'Project X', clientName: 'Client Z' },
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
        period: 'weekly',
    });
    const [searchQuery, setSearchQuery] = useState('');

    const getDates = () => {
        if (filters.period === 'weekly') {
            return Array.from({ length: 7 }, (_, i) => dayjs(selectedDate).add(i, 'day').format('MMM DD ddd'));
        }
        const daysInMonth = dayjs(selectedDate).daysInMonth();
        return Array.from({ length: daysInMonth }, (_, i) => dayjs(selectedDate).date(i + 1).format('MMM DD ddd'));
    };

    const changePeriod = (offset) => {
        setSelectedDate((prevDate) =>
            filters.period === 'weekly'
                ? prevDate.add(offset, 'week').startOf('week')
                : prevDate.add(offset, 'month').startOf('month')
        );
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredRows = rows.filter(
        (row) =>
            (filters.employee === '' || row.employee === filters.employee) &&
            (filters.jobName === '' || row.jobName === filters.jobName) &&
            (filters.projectName === '' || row.projectName === filters.projectName) &&
            (filters.clientName === '' || row.clientName === filters.clientName) &&
            (row.employee.toLowerCase().includes(searchQuery) ||
                row.jobName.toLowerCase().includes(searchQuery))
    );

    const columns = [
        { field: 'employee', headerName: 'Employee', width: 200 },
        { field: 'projectName', headerName: 'Project Name', width: 200 },
        { field: 'jobName', headerName: 'Task Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 250, renderCell: () => 'Worked on project tasks' },
        ...getDates().map((day, index) => ({
            field: `day${index}`,
            headerName: day,
            width: 100,
            renderCell: () => <TextField variant="outlined" size="small" defaultValue="08:00" sx={{ width: 80, mt: 0.7 }} />,
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
                    {filters.period === 'weekly'
                        ? `${selectedDate.format('MMM DD, YYYY')} - ${selectedDate.add(6, 'day').format('MMM DD, YYYY')}`
                        : selectedDate.format('MMMM YYYY')}
                </Typography>
                <IconButton onClick={() => changePeriod(1)}>
                    <ArrowForward />
                </IconButton>
            </Box>

            <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <TextField
                    placeholder="Search Employee or Task"
                    variant="outlined"
                    size="large"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <Select name="period" value={filters.period} onChange={handleFilterChange}>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                </FormControl>
          
                {['employee', 'jobName', 'projectName', 'clientName'].map((filterKey) => (
                    <FormControl key={filterKey} sx={{ minWidth: 150 }}>
                        <Select name={filterKey} value={filters[filterKey]} onChange={handleFilterChange} displayEmpty>
                            <MenuItem value="">All {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</MenuItem>
                            {[...new Set(dummyData.map((item) => item[filterKey]))].map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ))}
            </Box>

            <Paper sx={{ mt: 3, borderRadius: 2, width: '100%', height: Math.min(350 + filteredRows.length * 40, 600) }}>
                <DataGrid rows={filteredRows} columns={columns} pageSize={filteredRows.length > 0 ? filteredRows.length : 4} autoHeight disableSelectionOnClick />
            </Paper>
        </Box>
    );
};

export default TimeData;
