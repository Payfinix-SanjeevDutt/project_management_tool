import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Search, ArrowBack, ArrowForward } from '@mui/icons-material';
import {
    Box,
    Paper,
    Stack,
    Select,
    Avatar,
    Tooltip,
    MenuItem,
    TextField,
    Typography,
    IconButton,
    FormControl,
    InputAdornment,
    CircularProgress,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { EmptyContent } from 'src/components/empty-content';


    const CustomNoRowsOverlay = () => (
        <GridOverlay>
            <Box
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <EmptyContent
                    title="No Timesheet Data"
                    description="No records found for the selected period."
                />
            </Box>
        </GridOverlay>
    );
const TimeData = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('week'));
    const [filters, setFilters] = useState({
        employee: '',
        jobName: '',
        projectName: '',
        clientName: '',
        period: 'weekly',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const startDate =
                    filters.period === 'weekly'
                        ? dayjs(selectedDate).startOf('week')
                        : dayjs(selectedDate).startOf('month');
                const endDate =
                    filters.period === 'weekly'
                        ? startDate.add(6, 'day')
                        : startDate.endOf('month');

                const response = await axiosInstance.post(endpoints.timesheet.getallList, {
                    start_date: startDate.format('YYYY-MM-DD'),
                    end_date: endDate.format('YYYY-MM-DD'),
                });

                const data = await response.data;

                if (data.status) {
                    const formattedData = data.data.map((item, index) => ({
                        id: index + 1,
                        employee: item.employee_name,
                        jobName: item.job_name,
                        projectName: item.project_name,
                        description: item.description || 'N/A',
                        days: item.days,
                    }));
                    setRows(formattedData);
                } else {
                    console.error('Failed to fetch timesheet data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching timesheet data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedDate, filters.period]);

    const getDateObjects = () => {
        if (filters.period === 'weekly') {
            return Array.from({ length: 7 }, (_, i) => {
                const date = dayjs(selectedDate).add(i, 'day');
                return {
                    label: date.format('MMM DD ddd'),
                    key: date.format('YYYY-MM-DD'),
                };
            });
        }

        const daysInMonth = dayjs(selectedDate).daysInMonth();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = dayjs(selectedDate).date(i + 1);
            return {
                label: date.format('MMM DD ddd'),
                key: date.format('YYYY-MM-DD'),
            };
        });
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
            (row.employee.toLowerCase().includes(searchQuery) ||
                row.jobName.toLowerCase().includes(searchQuery))
    );

    const calculateTotalHours = (days) => {
        const validDateKeys = new Set(getDateObjects().map((d) => d.key));

        return [...validDateKeys].reduce((total, dateKey) => {
            const entries = days[dateKey] || [];

            const dailyTotal = entries.reduce((sum, entry) => {
                const hours = entry.total_hours ? parseInt(entry.total_hours.split(':')[0], 10) : 0;
                return sum + hours;
            }, 0);

            return total + dailyTotal;
        }, 0);
    };

    const columns = [
        {
            field: 'employee',
            headerName: 'Employee',
            width: 240,
            renderCell: (params) => {
                const employeeName = params.value || 'Unknown';
                const firstLetter = employeeName.charAt(0).toUpperCase();

                return (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                fontSize: 14,
                                width: 32,
                                height: 32,
                            }}
                        >
                            {firstLetter}
                        </Avatar>
                        <Typography variant="body2">{employeeName}</Typography>
                    </Stack>
                );
            },
        },
        { field: 'projectName', headerName: 'Project Name', width: 280},
        // { field: 'description', headerName: 'Description', width: 250 }, 
        ...getDateObjects().map(({ label, key }, index) => ({
            field: `day${index}`,
            headerName: label,
            width: 120,
            renderCell: (params) => {
                const isWeekend = [0, 6].includes(dayjs(key).day());
                const dayData = params.row.days[key]?.[0];
                const hours = isWeekend ? '--:--' : (dayData?.total_hours || '00:00');
                const workItem = dayData?.work_item || 'No Task';
            
                const hourValue = parseInt(hours.split(':')[0], 10);
                const isLessThan8 = !isWeekend && hourValue < 8 && hourValue > 0;
            
                const today = dayjs().startOf('day');
                const cellDate = dayjs(key).startOf('day');
                const isPastDate = cellDate.isBefore(today);
            
                const otherWorked = rows.some(
                    (row) => row.employee !== params.row.employee && row.days?.[key]?.[0]?.total_hours !== '00:00'
                );
            
                const showLeave = !isWeekend && hourValue === 0 && otherWorked && isPastDate;
            
                const cellStyle = {
                    width: 80,
                    height: 35,
                    mt: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: isLessThan8 || showLeave ? 'red' : 'black',
                    fontWeight: isLessThan8 || showLeave ? 600 : 400,
                };
            
                const displayText = showLeave ? 'Leave' : hours;
            
                return workItem !== 'No Task' && !isWeekend && !showLeave ? (
                    <Tooltip title={workItem} arrow>
                        <Box sx={cellStyle}>{displayText}</Box>
                    </Tooltip>
                ) : (
                    <Box sx={cellStyle}>{displayText}</Box>
                );
            }
                        
        })),

        {
            field: 'total',
            headerName: 'Total',
            width: 100,
            renderCell: (params) => `${calculateTotalHours(params.row.days)}:00`,
        },
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
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper
                    sx={{
                        mt: 3,
                        borderRadius: 2,
                        width: '100%',
                        height: Math.min(350 + filteredRows.length * 40, 600),
                    }}
                >
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={filteredRows.length > 0 ? filteredRows.length : 4}
                        autoHeight
                        disableSelectionOnClick
                        components={{
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        loading={loading} 
                    />
                </Paper>
            )}
        </Box>
    );
};

export default TimeData;
