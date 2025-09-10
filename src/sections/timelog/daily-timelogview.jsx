import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import Menu from '@mui/material/Menu';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
    Box,
    Grid,
    Dialog,
    Button,
    Avatar,
    Divider,
    MenuItem,
    TextField,
    Typography,
    ButtonBase,
    IconButton,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    DialogContent,
    DialogActions,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import AttendanceCalendarModal from 'src/pages/dashboard/projects/calenderviewEmplyee';

const getStatusColor = (status) => {
    if (status === '-') return '#6b7280';
    if (status.includes('Present')) return '#16a34a';
    if (status === 'Absent') return '#dc2626';
    if (status === 'Weekend') return '#4b5563';
    return '#6b7280';
};

const columns = (handleAvatarClick, handleEmployeeNameClick) => [
    {
        field: 'employee_avatar',
        headerName: 'Avatar',
        flex: 0.5,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <ButtonBase
                onClick={() =>
                    handleAvatarClick(params.row.employee_avatar, params.row.employee_name)
                }
                sx={{ borderRadius: '50%' }}
            >
                <Avatar src={params.row.employee_avatar}>
                    {params.row.employee_name?.[0] || '?'}
                </Avatar>
            </ButtonBase>
        ),
    },
    {
        field: 'employee_name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
            <Typography
                variant="body2"
                component="a"
                sx={{
                    color: '#0f172a',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'none' },
                }}
                onClick={() => handleEmployeeNameClick(params.row)}
            >
                {params.row.employee_name}
            </Typography>
        ),
    },
    { field: 'location', headerName: 'Location', flex: 1, valueGetter: () => 'Bangalore' },
    {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        renderCell: (params) => (
            <span style={{ color: getStatusColor(params.value), fontWeight: 500 }}>
                {params.value.split('(')[0].trim()}
            </span>
        ),
    },
    {
        field: 'clock_in',
        headerName: 'Check-In',
        flex: 1,
        renderCell: (params) => (
            <span style={{ color: '#16a34a', fontWeight: 400 }}>
                {params.value ? `${params.value} AM` : '--'}
            </span>
        ),
    },
    {
        field: 'clock_out',
        headerName: 'Check-Out',
        flex: 1,
        renderCell: (params) => {
            const convertTo12Hour = (time24) => {
                if (!time24) return '--:--';
                const [hourStr, minute] = time24.split(':');
                let hour = parseInt(hourStr, 10);
                const suffix = hour >= 12 ? 'PM' : 'AM';
                if (hour === 0) hour = 12;
                else if (hour > 12) hour -= 12;
                return `${hour}:${minute} ${suffix}`;
            };
            return (
                <span style={{ fontWeight: 500, color: '#16a34a' }}>
                    {params.value ? convertTo12Hour(params.value) : '--:--'}
                </span>
            );
        },
    },
    {
        field: 'total_hours',
        headerName: 'Total Hours',
        flex: 1,
        renderCell: (params) => {
            if (!params.value) return '--:--';
            const [hourStr] = params.value.split(':');
            const isLow = parseInt(hourStr, 10) < 8;
            return (
                <span style={{ color: isLow ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                    {params.value}
                </span>
            );
        },
    },
    { field: 'shift', headerName: 'Shift', flex: 1, valueGetter: () => '10:00 AM - 6:30 PM' },
    { field: 'teams', headerName: 'Teams', flex: 1, valueGetter: () => '—' },
];

const DailyTimeLogView = () => {
    console.log("hari")
    const [dailyLogs, setDailyLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [open, setOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [employeeLogData, setEmployeeLogData] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.post(endpoints.timelog.daily, {
                    date: currentDate.format('YYYY-MM-DD'),
                });
                if (response.data?.status && response.data?.data?.logs) {
                    const logsWithoutHR12345 = response.data.data.logs.filter(
                        (log) => log.employee_id !== 'HR123456'
                    );

                    const enriched = logsWithoutHR12345.map((log, index) => ({
                        id: index,
                        ...log,
                        status: log.clock_in ? 'Present' : 'Absent',
                    }));

                    // setLogs(enriched);
                    setFilteredLogs(enriched);
                } else {
                    setDailyLogs([]);
                    setFilteredLogs([]);
                }
            } catch (error) {
                console.error('Error fetching time logs:', error);
                setDailyLogs([]);
                setFilteredLogs([]);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchLogs();
    }, [currentDate]);

    useEffect(() => {
        let filtered = dailyLogs;
        if (statusFilter !== 'All') {
            filtered = filtered.filter((log) => log.status === statusFilter);
        }
        if (search) {
            filtered = filtered.filter((log) =>
                log.employee_name.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFilteredLogs(filtered);
    }, [search, statusFilter, dailyLogs]);

    const handleAvatarClick = (avatar, name) => {
        setSelectedAvatar(avatar);
        setSelectedName(name);
        setOpen(true);
    };

    const handleEmployeeNameClick = async (employee) => {
        try {
            const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
            const endDate = dayjs().endOf('month').format('YYYY-MM-DD');

            const response = await axiosInstance.post(endpoints.timelog.monthly, {
                start_date: startDate,
                end_date: endDate,
                employee_id: employee.employee_id,
            });

            if (response.data?.status) {
                const { date_range, employees } = response.data.data;
                if (employees && employees.length > 0) {
                    const employeeData = employees[0];
                    const logs = date_range.map((date) => ({
                        date: date.date,
                        status: employeeData.attendance[date.date],
                        is_weekend: date.is_weekend,
                        is_future: date.is_future,
                    }));
                    setEmployeeLogData(logs);
                }
            } else {
                setEmployeeLogData([]);
            }
        } catch (err) {
            console.error('Error fetching employee logs:', err);
            setEmployeeLogData([]);
        }
        setSelectedEmployeeId(employee.employee_id);
        setCalendarOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAvatar('');
        setSelectedName('');
    };
    const generateMonthlyReport = async (month, year) => {
        setLoading(true);
        try {
            const reportDate = dayjs().month(month).year(year);
            const startDate = reportDate.startOf('month').format('YYYY-MM-DD');
            const endDate = reportDate.endOf('month').format('YYYY-MM-DD');
            const monthYear = reportDate.format('MMMM YYYY');

            const response = await axiosInstance.post(endpoints.timelog.monthly, {
                start_date: startDate,
                end_date: endDate,
            });

            if (!response.data?.status) {
                throw new Error(response.data?.message || 'Server returned unsuccessful response');
            }

            const { date_range, employees } = response.data.data || {};

            if (!employees || !Array.isArray(employees)) {
                throw new Error('No employee data available');
            }

            let htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>
                    body { font-family: Arial; }
                    table { border-collapse: collapse; width: 100%; }
                    th { background-color: #f2f2f2; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #ddd; }
                    td { padding: 8px; border: 1px solid #ddd; text-align: center; vertical-align: middle; }
                    .present { color:rgb(63, 127, 61); }
                    .present-hours { color: #333; font-size: 0.8em; margin-top: 3px; }
                    .absent { color:rgb(212, 17, 17); }
                    .weekend { color:rgb(81, 170, 202); }
                    .future { color: #808080; }
                    .status-cell { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; }
                    .hours-cell { font-weight: normal; color: #000; }
                    .total-hours { font-weight: normal; color: #dc2626; }
                </style>
            </head>
            <body>
                <h2>Attendance Report - ${monthYear}</h2>
                <table>
                    <tr>
                        <th>Employee Name</th>
            `;

            date_range.forEach((date) => {
                htmlContent += `<th>${date.day_number}-${date.month} (${date.day_name})</th>`;
            });
            htmlContent += `<th>Total Present Days</th><th>Actual Work Hours</th><th>Total Worked Hours</th></tr>`;

            employees.forEach((employee) => {
                htmlContent += `<tr><td>${employee.employee_name}</td>`;
                
                let totalWorkedMinutes = 0;
                let weekdaysCount = 0;

                date_range.forEach((date) => {
                    const dayOfWeek = dayjs(date.date).day();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const isFuture = dayjs(date.date).isAfter(dayjs(), 'day');

                    if (!isWeekend && !isFuture) {
                        weekdaysCount +=1 ;
                    }

                    if (isWeekend) {
                        htmlContent += `<td class="weekend"><div class="status-cell">Weekend</div></td>`;
                    } else if (isFuture) {
                        htmlContent += `<td class="future"><div class="status-cell">-</div></td>`;
                    } else {
                        const status = employee.attendance?.[date.date] || 'Absent';
                        if (status.includes('Present')) {
                            const hoursMatch = status.match(/\(([^)]+)\)/);
                            const hours = hoursMatch ? hoursMatch[1] : '';
                            
                            // Calculate total worked minutes
                            if (hours) {
                                const [h, m] = hours.split(':').map(Number);
                                totalWorkedMinutes += h * 60 + m;
                            }

                            htmlContent += `
                                <td class="present">
                                    <div class="status-cell">
                                        Present
                                        ${hours ? `<div class="present-hours">${hours}</div>` : ''}
                                    </div>
                                </td>
                            `;
                        } else {
                            htmlContent += `<td class="absent"><div class="status-cell">Absent</div></td>`;
                        }
                    }
                });

                // Calculate total worked hours
                const totalHours = Math.floor(totalWorkedMinutes / 60);
                const totalMinutes = totalWorkedMinutes % 60;
                const formattedTotalHours = totalMinutes > 0 
                    ? `${totalHours}hrs ${totalMinutes}mins` 
                    : `${totalHours}hrs`;

                // Calculate actual work hours (8 hours per weekday)
                const actualWorkHours = weekdaysCount * 8;
                const formattedActualHours = `${actualWorkHours}hrs`;

                const presentDays = employee.present_days || 0;
                htmlContent += `<td><div class="status-cell">${presentDays}</div></td>`;
                htmlContent += `<td class="hours-cell"><div class="status-cell">${formattedActualHours}</div></td>`;
                htmlContent += `<td class="total-hours"><div class="status-cell">${formattedTotalHours}</div></td></tr>`;
            });

            htmlContent += `</table></body></html>`;

            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `Attendance_Report_${monthYear.replace(' ', '_')}.xls`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating monthly report:', error);
            alert(`Error: ${error.message || 'Failed to generate monthly report'}`);
        } finally {
            setLoading(false);
        }
    };

    
    const handleGenerateCurrentMonthReport = () => {
        generateMonthlyReport(dayjs().month(), dayjs().year());
        handleMenuClose();
    };

    const handleOpenReportDialog = () => {
        setReportDialogOpen(true);
        handleMenuClose();
    };

    const handleCloseReportDialog = () => {
        setReportDialogOpen(false);
    };

    const handleGenerateCustomReport = () => {
        generateMonthlyReport(selectedMonth, selectedYear);
        handleCloseReportDialog();
    };

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
                                onChange={(val) => setCurrentDate(val)}
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
                        <Grid item>
                            <IconButton onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    elevation: 4,
                                    sx: {
                                        borderRadius: 2,
                                        minWidth: { xs: 200, sm: 250 },
                                        mt: 1,
                                        p: 0.5,
                                    
                                    },
                                }}
                            >
                                <MenuItem onClick={handleGenerateCurrentMonthReport}>
                                    <ListItemIcon sx={{ minWidth: 32, mr: 0.5 }}>
                                        <FileDownloadIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="This Month's Report"
                                        primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </MenuItem>
                                <MenuItem onClick={handleOpenReportDialog}>
                                    <ListItemIcon sx={{ minWidth: 32, mr: 0.5 }}>
                                        <FileDownloadIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Custom Month Report"
                                        primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <DataGrid
                    rows={filteredLogs}
                    columns={columns(handleAvatarClick, handleEmployeeNameClick)}
                    pageSize={10}
                    loading={loading}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                />
            </Box>

            {/* Avatar Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        maxWidth: 600,
                        px: 4,
                        pt: 3,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden',
                        mx: 'auto',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 0,
                        pr: 1,
                    }}
                >
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pb: 4,
                    }}
                >
                    <Avatar
                        src={selectedAvatar}
                        sx={{
                            width: 260,
                            height: 260,
                            mb: 3,
                            borderRadius: '50%',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                            '& img': {  
                                objectFit: 'cover',
                            },
                        }}
                    >
                        {selectedName?.[0] || '?'}
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} align="center">
                        {selectedName}
                    </Typography>
                </DialogContent>
            </Dialog>

            {/* Custom Report Dialog */}
            <Dialog
                open={reportDialogOpen}
                onClose={handleCloseReportDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: 600,
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3
                    }}>
                        <Typography variant="h6" fontWeight={600}>
                            Generate Custom Report
                        </Typography>
                        <IconButton 
                            onClick={handleCloseReportDialog} 
                            sx={{ color: 'text.secondary' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Select month and year to generate the attendance report
                    </Typography>
                    
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="Month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                variant="outlined"
                                size="medium"
                            >
                                {months.map((month, index) => (
                                    <MenuItem key={month} value={index}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="Year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                variant="outlined"
                                size="medium"
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider />
                
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseReportDialog}
                        variant="text"
                        color="inherit"
                        sx={{ 
                            borderRadius: 1.5, 
                            px: 4,
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerateCustomReport}
                        variant="contained"
                        color="primary"
                        sx={{ 
                            borderRadius: 1.5, 
                            px: 4,
                            boxShadow: 'none',
                            '&:hover': {
                                boxShadow: 'none',
                                backgroundColor: 'primary.dark',
                            }
                        }}
                        startIcon={<FileDownloadIcon />}
                    >
                        Generate Report
                    </Button>
                </DialogActions>
            </Dialog>

            <AttendanceCalendarModal
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                employeeId={selectedEmployeeId}
                employeeName={selectedName}
                logs={employeeLogData}
            />
        </Box>
    );
};

export default DailyTimeLogView;