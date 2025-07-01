import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import {
    Box,
    Card,
    Table,
    Paper,
    Stack,
    Avatar,
    Button,
    Dialog,
    Skeleton,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    IconButton,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
    TableContainer,
    TableSortLabel,
    TablePagination,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import TimeOverrunModal from 'src/sections/employees/timeoverun-model';
import OverrunModal from 'src/sections/employees/completed-overrun-modal';

import AttendanceCalendarModal from './calenderviewEmplyee';

// Date formatting utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Invalid Date';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
}

function formatDisplayDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'Invalid Date';
        
        const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${day} ${month} ${year}`;
    } catch (error) {
        console.error('Error formatting display date:', error);
        return 'N/A';
    }
}

function formatTimeDuration(minutes) {
    if (minutes === null || minutes === undefined) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0 && mins > 0) {
        return `${hours}hrs ${mins}mins`;
    }
    if (hours > 0) {
        return `${hours}hrs`;
    }
    if (mins > 0) {
        return `${mins}mins`;
    }
    return '0mins';
}

// Function to calculate missed time in minutes
function calculateMissedTime(clockIn, clockOut, expectedHours = 8) {
    if (!clockIn || !clockOut) return 0;
    
    try {
        const [inHours, inMinutes] = clockIn.split(':').map(Number);
        const [outHours, outMinutes] = clockOut.split(':').map(Number);
        
        const totalMinutesWorked = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
        const expectedMinutes = expectedHours * 60;
        
        const missedTime = Math.max(0, expectedMinutes - totalMinutesWorked);
        return missedTime;
    } catch (error) {
        console.error('Error calculating missed time:', error);
        return 0;
    }
}

function HomeUserView() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedOverrunType, setSelectedOverrunType] = useState('');
    const [selectedTimerunType, setSelectedTimeOver] = useState('');
    const [logData, setLogData] = useState([]);
    const [eid, setEid] = useState(null);
    const [delayDetails, setDelayDetails] = useState([]);
    const [openDelayDetails, setOpenDelayDetails] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(dayjs().month());
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [filteredDelayDetails, setFilteredDelayDetails] = useState([]);
    const [filterByMonth, setFilterByMonth] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleOpenModal3 = async (employeeId) => {
        try {
            const response = await axiosInstance.post(endpoints.timelog.list, {
                employee_id: employeeId,
            });

            if (response.data?.status) {
                const logs = response.data.data.map((log) => {
                    const missedTime = calculateMissedTime(log.clock_in, log.clock_out);
                    return {
                        date: formatDate(log.date),
                        checkin: log.clock_in,
                        checkout: log.clock_out,
                        status: log.clock_in && log.clock_out ? 'Present' : 'Absent',
                        isDelay: log.is_delay,
                        totalHours: log.total_hours,
                        missedTime: log.missedTime,
                    };
                });
                setLogData(logs);

                setReport((prevReport) =>
                    prevReport.map((emp) =>
                        emp.employee_id === employeeId
                            ? { 
                                ...emp, 
                                time_overrun: response.data.delay_count || 0,
                                total_missed_time: logs.reduce((sum, log) => sum + log.missedTime, 0)
                            }
                            : emp
                    )
                );
            } else {
                setLogData([]);
                console.error('API error:', response.data.message);
            }
        } catch (err) {
            setLogData([]);
            console.error('API call failed:', err);
        }

        setEid(employeeId);
        setOpenModal3(true);
    };

    const handleOpenDelayDetails = (employee) => {
        setCurrentEmployee(employee);
        
        // Format the delay details before setting them
        const formattedDetails = (employee.missed_logs || []).map(log => {
            const missedTime = calculateMissedTime(log.clock_in, log.clock_out);
            return {
                ...log,
                date: formatDate(log.date),
                displayDate: formatDisplayDate(log.date),
                totalHoursInMinutes: log.total_hours?.split(':').length >= 2 
                    ? parseInt(log.total_hours.split(':')[0], 10) * 60 + parseInt(log.total_hours.split(':')[1], 10)
                    : 0,
                missedTimeInMinutes: missedTime,
                clock_in: log.clock_in || 'N/A',
                clock_out: log.clock_out || 'N/A'
            };
        });
        
        setDelayDetails(formattedDetails);
        setFilteredDelayDetails(formattedDetails); // Show all records by default
        setFilterByMonth(false); // Start with all records visible
        setCurrentMonth(dayjs().month());
        setCurrentYear(dayjs().year());
        setOpenDelayDetails(true);
    };

    const toggleMonthFilter = () => {
        if (filterByMonth) {
            // Show all records
            setFilteredDelayDetails(delayDetails);
        } else {
            // Filter for current month
            filterDataByMonth(currentMonth, currentYear);
        }
        setFilterByMonth(!filterByMonth);
    };

    const filterDataByMonth = (month, year) => {
        const filtered = delayDetails.filter(detail => {
            const detailDate = dayjs(detail.date);
            return detailDate.month() === month && detailDate.year() === year;
        });
        setFilteredDelayDetails(filtered);
    };

    const handlePrevMonth = () => {
        const newMonth = currentMonth - 1;
        if (newMonth < 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
            filterDataByMonth(11, currentYear - 1);
        } else {
            setCurrentMonth(newMonth);
            filterDataByMonth(newMonth, currentYear);
        }
    };

    const handleNextMonth = () => {
        const newMonth = currentMonth + 1;
        if (newMonth > 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
            filterDataByMonth(0, currentYear + 1);
        } else {
            setCurrentMonth(newMonth);
            filterDataByMonth(newMonth, currentYear);
        }
    };

    const getMonthName = (monthIndex) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    };

    const filteredReport = report.filter((row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedFilteredReport = filteredReport.slice().sort((a, b) => {
        if (orderBy) {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        }
        return 0;
    });

    const columns = [
        { key: 'name', label: 'Employee name', icon: 'solar:user-outline', sortable: true },
        { key: 'attendance', label: 'Idle Time', sortable: true },
        { key: 'available_in', label: 'Available in', sortable: true },
        {
            key: 'total_projects',
            label: 'Total Projects',
            sortable: true,
        },
        { key: 'total_tasks', label: 'Total Tasks', sortable: true },
        {
            key: 'completed_tasks',
            label: 'Completed Tasks',
            sortable: true,
        },
        {
            key: 'inprogress_tasks',
            label: 'In-Progress Tasks',
            sortable: true,
        },
        {
            key: 'pending_tasks',
            label: 'Pending Tasks\n(To-Do tasks)',
            sortable: true,
        },
        {
            key: 'completed_overrun',
            label: 'Completed Overrun',
            sortable: true,
        },
        {
            key: 'inprogress_overrun',
            label: 'In-Progress Overrun',
            sortable: true,
        },
        {
            key: 'timelog',
            label: 'Timelogs',
        },
        {
            key: 'time_overrun',
            label: 'Clock-in/Clock-out Delay',
            sortable: true,
        },
    ];

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(endpoints.project.project_employee_report);

                const filteredData = response.data.filter(
                    (emp) =>
                        emp.employee_id !== 'ELKHGFJJKEHLKJG4102836' &&
                        emp.employee_id !== 'Nischal0001'
                );

                const reportWithDelays = await Promise.all(
                    filteredData.map(async (emp) => {
                        try {
                            const timeLogResponse = await axiosInstance.post(
                                endpoints.timelog.list,
                                {
                                    employee_id: emp.employee_id,
                                }
                            );

                            let delayCount = 0;
                            let totalMissedTime = 0;
                            let missedLogs = [];

                            if (timeLogResponse.data?.status) {
                                delayCount = timeLogResponse.data.delay_count || 0;
                                missedLogs = timeLogResponse.data.data
                                    .filter((log) => log.is_delay)
                                    .map((log) => ({
                                        ...log,
                                        date: log.date,
                                        employee_name: emp.name,
                                        clock_in: log.clock_in,
                                        clock_out: log.clock_out,
                                        total_hours: log.total_hours,
                                        missed_time: calculateMissedTime(log.clock_in, log.clock_out)
                                    }));

                                totalMissedTime = missedLogs.reduce((sum, log) => sum + (log.missed_time || 0), 0);
                            }

                            return {
                                ...emp,
                                time_overrun: delayCount,
                                total_missed_time: totalMissedTime,
                                missed_logs: missedLogs
                            };
                        } catch (err) {
                            console.error(`Failed to fetch logs for ${emp.employee_id}:`, err);
                            return {
                                ...emp,
                                time_overrun: 0,
                                total_missed_time: 0,
                                missed_logs: [],
                            };
                        }
                    })
                );

                setReport(reportWithDelays);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch report:', err);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const handleRequestSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (employeeId, overrunType) => {
        setSelectedEmployeeId(employeeId);
        setSelectedOverrunType(overrunType);
        setOpenModal(true);
    };
    const handleOpenModal1 = (employeeId, missedDays) => {
        setSelectedEmployeeId(employeeId);
        setSelectedTimeOver(missedDays);
        setOpenModal1(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployeeId(null);
    };
    const handleCloseModal1 = () => {
        setOpenModal1(false);
        setSelectedEmployeeId(null);
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card
            component={Paper}
            sx={{ borderRadius: 2, overflowX: 'auto', margin: { xs: 1, sm: 2, md: 4 } }}
        >
            <TableContainer
                sx={{
                    maxHeight: '80vh',
                    overflowX: 'auto',
                    '& thead th': {
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 1,
                    },
                }}
            >
                {loading ? (
                    <Stack spacing={2} sx={{ padding: 2 }}>
                        <Skeleton variant="rectangular" height={40} />
                        <Skeleton variant="rectangular" height={40} />
                        <Skeleton variant="rectangular" height={40} />
                    </Stack>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        sx={{
                                            minWidth: col.key === 'name' ? 180 : 80,
                                            maxWidth: col.key === 'name' ? 220 : 100,
                                            textAlign: 'center',
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                            lineHeight: 1.4,
                                            padding: '12px 8px',
                                            fontWeight: 'bold',
                                            backgroundColor: 'background.paper',
                                        }}
                                    >
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === col.key}
                                                direction={orderBy === col.key ? order : 'asc'}
                                                onClick={() => handleRequestSort(col.key)}
                                            >
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Iconify
                                                        icon={col.icon}
                                                        width={20}
                                                        sx={{ color: 'grey.500' }}
                                                    />
                                                    <Typography variant="body2">
                                                        {col.label}
                                                    </Typography>
                                                </span>
                                            </TableSortLabel>
                                        ) : (
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                <Iconify
                                                    icon={col.icon}
                                                    width={20}
                                                    sx={{ color: 'grey.500' }}
                                                />
                                                <Typography variant="body2">{col.label}</Typography>
                                            </span>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedFilteredReport.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <EmptyContent
                                            sx={{ py: 10 }}
                                            title="No employee task data found."
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedFilteredReport
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow key={row.employee_id}>
                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col.key}
                                                    align="center"
                                                    size="small"
                                                    sx={{
                                                        borderRight:
                                                            col.key !== 'pending_tasks'
                                                                ? '1px dashed rgba(0, 0, 0, 0.1)'
                                                                : '',
                                                        minWidth: col.key === 'name' ? 180 : 80,
                                                        maxWidth: col.key === 'name' ? 220 : 100,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        padding: '12px 8px',
                                                        height: 56,
                                                    }}
                                                >
                                                    {col.key === 'name' ? (
                                                        <Stack
                                                            direction="row"
                                                            spacing={2}
                                                            alignItems="center"
                                                            sx={{ width: '100%' }}
                                                        >
                                                            <Avatar
                                                                alt={row.name || 'User'}
                                                                src={row.avatar}
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    bgcolor: row.avatar,
                                                                    color: 'white',
                                                                    fontSize: 20,
                                                                }}
                                                            >
                                                                {!row.avatar && row.name
                                                                    ? row.name
                                                                        .charAt(0)
                                                                        .toUpperCase()
                                                                    : 'A'}
                                                            </Avatar>
                                                            <Stack spacing={0.5}>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight="bold"
                                                                    color="text.primary"
                                                                    align="left"
                                                                >
                                                                    {row.name}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    ) : col.key === 'completed_overrun' ||
                                                    col.key === 'inprogress_overrun' ||
                                                    col.key === 'pending_tasks' ? (
                                                        row[col.key] !== 0 ? (
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontWeight: 'bold',
                                                                    color: 'error.main',
                                                                    cursor: 'pointer',
                                                                    textDecoration: 'underline',
                                                                    '&:hover': {
                                                                        color: 'error.dark',
                                                                    },
                                                                }}
                                                                onClick={() =>
                                                                    handleOpenModal(
                                                                        row.employee_id,
                                                                        col.key
                                                                    )
                                                                }
                                                            >
                                                                {row[col.key]}
                                                            </Box>
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontWeight: 'bold',
                                                                    color: 'inherit',
                                                                }}
                                                            >
                                                                {row[col.key]}
                                                            </Box>
                                                        )
                                                    ) : col.key === 'time_overrun' ? (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                cursor: row.total_missed_time > 0 ? 'pointer' : 'default',
                                                            }}
                                                            onClick={
                                                                row.total_missed_time > 0
                                                                    ? () => handleOpenDelayDetails(row)
                                                                    : undefined
                                                            }
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="bold"
                                                                sx={{
                                                                    color: row.time_overrun > 0 ? 'error.main' : 'text.primary',
                                                                    textDecoration: row.time_overrun > 0 ? 'underline' : 'none',
                                                                    '&:hover': row.time_overrun > 0 ? { color: 'error.dark' } : {},
                                                                }}
                                                            >
                                                                {row.time_overrun} day(s)
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: row.total_missed_time > 0 ? 'error.main' : 'text.secondary',
                                                                }}
                                                            >
                                                                {/* {formatTimeDuration(row.total_missed_time)} */}
                                                            </Typography>
                                                        </Box>
                                                    ) : col.key === 'timelog' ? (
                                                        <Box
                                                            sx={{
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                            }}
                                                            onClick={() =>
                                                                handleOpenModal3(row.employee_id)
                                                            }
                                                        >
                                                            <Iconify
                                                                icon="uil:calender"
                                                                style={{ color: 'black' }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                display: 'inline-block',
                                                                px: 1.5,
                                                                py: 0.5,
                                                                borderRadius: 1,
                                                                fontWeight: 'bold',
                                                                color: (theme) =>
                                                                    row[col.key] === 0
                                                                        ? 'inherit'
                                                                        : theme.palette.text
                                                                            .primary,
                                                            }}
                                                        >
                                                            {row[col.key]}
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Delay Details Dialog */}
            <Dialog
                open={openDelayDetails}
                onClose={() => setOpenDelayDetails(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '70vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        py: 2.5,
                        px: 2,
                        backgroundColor: 'background.paper',
                        textAlign: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    Employee : {currentEmployee?.name || 'N/A'}
                </DialogTitle>

                <DialogContent dividers sx={{ 
                    px: { xs: 1, sm: 2 }, 
                    py: 1.5,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    gap: 1.5
                }}>
                    {/* Month Navigation - Centered */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 1.5,
                        flexShrink: 0
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <IconButton 
                                onClick={handlePrevMonth} 
                                size="small"
                                disabled={!filterByMonth}
                            >
                                <ArrowLeft />
                            </IconButton>
                            <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: 'center' }}>
                                {filterByMonth ? `${getMonthName(currentMonth)} ${currentYear}` : 'All Records'}
                            </Typography>
                            <IconButton 
                                onClick={handleNextMonth} 
                                size="small"
                                disabled={!filterByMonth}
                            >
                                <ArrowRight />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    {/* Toggle Filter Button - Centered below month navigation */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        flexShrink: 0
                    }}>
                        <Button
                            variant={filterByMonth ? "contained" : "outlined"}
                            onClick={toggleMonthFilter}
                            size="small"
                        >
                            {filterByMonth ? 'Show All Records' : 'Filter by Month'}
                        </Button>
                    </Box>
                    
                    {/* Table Container */}
                    <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1
                    }}>
                        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600, 
                                                backgroundColor: 'background.paper',
                                                width: '33%',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 2
                                            }}
                                        >
                                            Date
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600, 
                                                backgroundColor: 'background.paper',
                                                width: '33%',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 2
                                            }}
                                        >
                                            Hours Worked
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ 
                                                fontWeight: 600, 
                                                backgroundColor: 'background.paper',
                                                width: '33%',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 2
                                            }}
                                        >
                                            Missed Time
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDelayDetails.length > 0 ? (
                                        filteredDelayDetails.map((detail, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell 
                                                    align="center" 
                                                    sx={{ width: '33%', py: 1.25 }}
                                                >
                                                    {detail.displayDate}
                                                </TableCell>
                                                <TableCell 
                                                    align="center" 
                                                    sx={{ width: '33%', py: 1.25 }}
                                                >
                                                    {formatTimeDuration(detail.totalHoursInMinutes)}
                                                </TableCell>
                                                <TableCell 
                                                    align="center" 
                                                    sx={{ 
                                                        width: '33%',
                                                        py: 1.25,
                                                        color: detail.missedTimeInMinutes > 0 ? 'error.main' : 'inherit'
                                                    }}
                                                >
                                                    {formatTimeDuration(detail.missedTimeInMinutes)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell 
                                                colSpan={3} 
                                                align="center" 
                                                sx={{ 
                                                    py: 4,
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                No delay records found {filterByMonth ? 'for selected month' : ''}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ 
                    px: 2, 
                    py: 1.75,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    justifyContent: 'center'
                }}>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDelayDetails(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Other modals */}
            <OverrunModal
                open={openModal}
                handleClose={handleCloseModal}
                assigneeId={selectedEmployeeId}
                overrunType={selectedOverrunType}
            />
            <TimeOverrunModal
                open={openModal1}
                handleClose={handleCloseModal1}
                assigneeId={selectedEmployeeId}
                missedDays={selectedTimerunType}
            />
            <AttendanceCalendarModal
                open={openModal3}
                onClose={() => setOpenModal3(false)}
                logs={logData}
                employeeId={eid}
            />

            {!loading && report.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={report.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Card>
    );
}

export default HomeUserView;