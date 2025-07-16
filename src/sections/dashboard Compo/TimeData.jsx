import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Search, Download, ArrowBack, ArrowForward, CalendarMonth } from '@mui/icons-material';
import {
    Box,
    Grid,
    Paper,
    Stack,
    Select,
    Avatar,
    Button,
    Dialog,
    Divider,
    Tooltip,
    useTheme,
    MenuItem,
    TextField,
    InputLabel,    
    IconButton,
    Typography,
    DialogTitle,
    FormControl,
    DialogContent,
    DialogActions,
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

const exportToExcel = (rows, dateObjects, selectedDate) => {
    const today = dayjs().startOf('day');
    
    const calculateTotalHours = (days) => {
        let totalHours = 0;
        let totalMinutes = 0;

        dateObjects.forEach(({ key }) => {
            const cellDate = dayjs(key).startOf('day');
            if (!cellDate.isAfter(today)) {
                const entries = days[key] || [];
                entries.forEach(entry => {
                    if (entry.total_hours) {
                        const [hours, minutes] = entry.total_hours.split(':').map(Number);
                        totalHours += hours;
                        totalMinutes += minutes;
                    }
                });
            }
        });

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;

        return `${totalHours}:${String(totalMinutes).padStart(2, '0')}`;
    };

    const calculateActualTotal = () => {
        let workingDays = 0;
        
        dateObjects.forEach(({ key }) => {
            const cellDate = dayjs(key).startOf('day');
            if (!cellDate.isAfter(today)) {
                const day = dayjs(key).day();
                if (day !== 0 && day !== 6) {
                    workingDays += 1;
                }
            }
        });

        return `${workingDays * 8}:00`;
    };

    const xml = `<?xml version="1.0"?>
    <ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
        <ss:Styles>
            <ss:Style ss:ID="Default">
                <ss:Alignment ss:Vertical="Center"/>
            </ss:Style>
            <ss:Style ss:ID="Weekend">
                <ss:Font ss:Color="#00B0FF"/>
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
            </ss:Style>
            <ss:Style ss:ID="Center">
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
            </ss:Style>
            <ss:Style ss:ID="Header">
                <ss:Font ss:Bold="1"/>
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
            </ss:Style>
            <ss:Style ss:ID="TaskCell">
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
                <ss:Font ss:Size="9" ss:Color="#555555"/>
            </ss:Style>
            <ss:Style ss:ID="HoursCell">
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
                <ss:Font ss:Size="10" ss:Bold="1"/>
            </ss:Style>
            <ss:Style ss:ID="FutureDate">
                <ss:Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
                <ss:Font ss:Color="#999999"/>
            </ss:Style>
        </ss:Styles>
        <ss:Worksheet ss:Name="Timesheet">
            <ss:Table>
                <ss:Column ss:Width="120"/>
                <ss:Column ss:Width="120"/>
                ${dateObjects.map(() => '<ss:Column ss:Width="100"/>').join('')}
                <ss:Column ss:Width="80"/>
                <ss:Column ss:Width="80"/>
                
                <ss:Row>
                    <ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">Employee</ss:Data></ss:Cell>
                    <ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">Project</ss:Data></ss:Cell>
                    ${dateObjects.map(({ label }) => 
                        `<ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">${label}</ss:Data></ss:Cell>`
                    ).join('')}
                    <ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">Total Hours</ss:Data></ss:Cell>
                    <ss:Cell ss:StyleID="Header"><ss:Data ss:Type="String">Actual Total</ss:Data></ss:Cell>
                </ss:Row>
                
                ${rows.map(row => `<ss:Row>
                    <ss:Cell><ss:Data ss:Type="String">${row.employee || 'Unknown'}</ss:Data></ss:Cell>
                    <ss:Cell><ss:Data ss:Type="String">${row.projectName || ''}</ss:Data></ss:Cell>
                    ${dateObjects.map(({ key }) => {
                        const cellDate = dayjs(key).startOf('day');
                        const isFutureDate = cellDate.isAfter(today);
                        const isWeekend = [0, 6].includes(dayjs(key).day());
                        
                        if (isFutureDate) {
                            return `<ss:Cell ss:StyleID="FutureDate"><ss:Data ss:Type="String">-</ss:Data></ss:Cell>`;
                        }
                        
                        if (isWeekend) {
                            return `<ss:Cell ss:StyleID="Weekend"><ss:Data ss:Type="String">Weekend</ss:Data></ss:Cell>`;
                        }
                        
                        const dayData = row.days[key]?.[0];
                        if (!dayData) {
                            return `<ss:Cell ss:StyleID="TaskCell"><ss:Data ss:Type="String">00:00\nNo Task</ss:Data></ss:Cell>`;
                        }
                        
                        const hours = dayData.total_hours || '00:00';
                        const workItem = dayData.work_item || 'No Task';
                        return `<ss:Cell ss:StyleID="TaskCell">
                            <ss:Data ss:Type="String">
                                <ss:Span ss:StyleID="HoursCell">${hours}</ss:Span>
                                <ss:Span>${String.fromCharCode(10)}${workItem}</ss:Span>
                            </ss:Data>
                        </ss:Cell>`;
                    }).join('')}
                    <ss:Cell ss:StyleID="Center"><ss:Data ss:Type="String">${calculateTotalHours(row.days)}</ss:Data></ss:Cell>
                    <ss:Cell ss:StyleID="Center"><ss:Data ss:Type="String">${calculateActualTotal()}</ss:Data></ss:Cell>
                </ss:Row>`).join('')}
            </ss:Table>
        </ss:Worksheet>
    </ss:Workbook>`;
    
    const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `timesheet_${selectedDate.format('MMMM_YYYY')}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const createDateObjects = month => 
    Array.from({ length: month.daysInMonth() }, (_, i) => {
        const date = month.date(i + 1);
        return {
            label: date.format('MMM DD ddd'),
            key: date.format('YYYY-MM-DD'),
        };
    });

const TimeData = () => {
    const theme = useTheme();
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
    const [isExporting, setIsExporting] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportMonth, setExportMonth] = useState(dayjs().format('MM'));
    const [exportYear, setExportYear] = useState(dayjs().format('YYYY'));
    const [futureMonthWarning, setFutureMonthWarning] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const startDate = filters.period === 'weekly'
                    ? dayjs(selectedDate).startOf('week')
                    : dayjs(selectedDate).startOf('month');
                
                const endDate = filters.period === 'weekly'
                    ? startDate.add(6, 'day')
                    : startDate.endOf('month');

                const response = await axiosInstance.post(endpoints.timesheet.getallList, {
                    start_date: startDate.format('YYYY-MM-DD'),
                    end_date: endDate.format('YYYY-MM-DD'),
                });

                const { data } = response;

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
        setSelectedDate((prevDate) => (
            filters.period === 'weekly'
                ? prevDate.add(offset, 'week').startOf('week')
                : prevDate.add(offset, 'month').startOf('month')
        ));
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const handleExport = () => {
        const dateObjects = getDateObjects();
        exportToExcel(rows, dateObjects, selectedDate);
    };

    const handleExportAnyMonth = async () => {
        setIsExporting(true);
        try {
            const selectedMonth = dayjs(`${exportYear}-${exportMonth}-01`);
            const startDate = selectedMonth.startOf('month');
            const endDate = selectedMonth.endOf('month');
            
            const response = await axiosInstance.post(endpoints.timesheet.getallList, {
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
            });

            const { data } = response;

            if (data.status) {
                const formattedData = data.data.map((item, index) => ({
                    id: index + 1,
                    employee: item.employee_name,
                    jobName: item.job_name,
                    projectName: item.project_name,
                    description: item.description || 'N/A',
                    days: item.days,
                }));
                
                const dateObjects = createDateObjects(selectedMonth);
                exportToExcel(formattedData, dateObjects, selectedMonth);
                setExportDialogOpen(false);
            } else {
                console.error('Failed to fetch timesheet data:', data.message);
            }
        } catch (error) {
            console.error('Error exporting timesheet:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleMonthYearChange = (type, value) => {
        if (type === 'month') {
            setExportMonth(value);
        } else {
            setExportYear(value);
        }
        
        const currentDate = dayjs();
        const selectedMonth = dayjs(`${type === 'month' ? exportYear : value}-${type === 'month' ? value : exportMonth}-01`);
        setFutureMonthWarning(selectedMonth.isAfter(currentDate, 'month'));
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
        const today = dayjs().startOf('day');
        let totalHours = 0;
        let totalMinutes = 0;

        getDateObjects().forEach(({ key }) => {
            const cellDate = dayjs(key).startOf('day');
            if (!cellDate.isAfter(today)) {
                const entries = days[key] || [];
                entries.forEach(entry => {
                    if (entry.total_hours) {
                        const [hours, minutes] = entry.total_hours.split(':').map(Number);
                        totalHours += hours;
                        totalMinutes += minutes;
                    }
                });
            }
        });

        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;

        return `${totalHours}:${String(totalMinutes).padStart(2, '0')}`;
    };

    const calculateActualTotal = () => {
        const today = dayjs().startOf('day');
        let workingDays = 0;
        
        getDateObjects().forEach(({ key }) => {
            const date = dayjs(key).startOf('day');
            if (!date.isAfter(today)) {
                const day = date.day();
                if (day !== 0 && day !== 6) {
                    workingDays += 1;
                }
            }
        });

        return `${workingDays * 8}:00`;
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
        { field: 'projectName', headerName: 'Project Name', width: 280 },
        ...getDateObjects().map(({ label, key }, index) => ({
            field: `day${index}`,
            headerName: label,
            width: 120,
            renderCell: (params) => {
                const today = dayjs().startOf('day');
                const cellDate = dayjs(key).startOf('day');
                const isFutureDate = cellDate.isAfter(today);
                const isWeekend = [0, 6].includes(dayjs(key).day());
                
                if (isFutureDate) {
                    return (
                        <Box sx={{
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
                            color: '#999',
                        }}>
                            -
                        </Box>
                    );
                }
                
                if (isWeekend) {
                    return (
                        <Box sx={{
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
                            color: '#00B0FF',
                        }}>
                            Weekend
                        </Box>
                    );
                }
                
                const dayData = params.row.days[key]?.[0];
                const hours = dayData?.total_hours || '00:00';
                const workItem = dayData?.work_item || 'No Task';
                const hourValue = parseInt(hours.split(':')[0], 10);
                
                const otherWorked = rows.some(
                    (row) => row.employee !== params.row.employee && row.days?.[key]?.[0]?.total_hours !== '00:00'
                );
                
                let displayText = hours;
                let textColor = 'black';
                let fontWeight = 400;
                
                if (hourValue === 0) {
                    if (otherWorked) {
                        displayText = 'Absent';
                        textColor = 'red';
                        fontWeight = 600;
                    }
                } else if (hourValue < 8) {
                    textColor = 'red';
                    fontWeight = 600;
                }
                
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
                    color: textColor,
                    fontWeight,
                };
                
                return workItem !== 'No Task' && hourValue > 0 ? (
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
            renderCell: (params) => calculateTotalHours(params.row.days),
        },
        {
            field: 'actualTotal',
            headerName: 'Actual Total',
            width: 120,
            renderCell: () => calculateActualTotal(),
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
                {filters.period === 'monthly' && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExport}
                            disabled={rows.length === 0}
                            sx={{ backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: '#f5f5f5' } }}
                        >
                            Export Current Month
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={() => setExportDialogOpen(true)}
                            disabled={rows.length === 0}
                            sx={{ backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: '#f5f5f5' } }}
                        >
                            Export Any Month
                        </Button>
                    </>
                )}
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

            <Dialog 
                open={exportDialogOpen} 
                onClose={() => setExportDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarMonth color="primary" />
                        <Typography variant="h6">Export Timesheet</Typography>
                    </Stack>
                </DialogTitle>
                
                <Divider />
                
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Select the month and year you want to export
                        </Typography>
                        
                        {futureMonthWarning && (
                            <Box 
                                sx={{ 
                                    backgroundColor: theme.palette.warning.light,
                                    color: theme.palette.warning.dark,
                                    p: 1.5,
                                    borderRadius: 1,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="body2">
                                    The selected month is in the future. The exported file will show empty data for future dates.
                                </Typography>
                            </Box>
                        )}
                        
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="month-select-label">Month</InputLabel>
                                    <Select
                                        labelId="month-select-label"
                                        value={exportMonth}
                                        label="Month"
                                        onChange={(e) => handleMonthYearChange('month', e.target.value)}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const monthNum = String(i + 1).padStart(2, '0');
                                            const monthName = dayjs().month(i).format('MMMM');
                                            return (
                                                <MenuItem key={monthNum} value={monthNum}>
                                                    {monthName}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="year-select-label">Year</InputLabel>
                                    <Select
                                        labelId="year-select-label"
                                        value={exportYear}
                                        label="Year"
                                        onChange={(e) => handleMonthYearChange('year', e.target.value)}
                                    >
                                        {Array.from({ length: 10 }, (_, i) => {
                                            const year = dayjs().year() - i;
                                            return (
                                                <MenuItem key={year} value={year.toString()}>
                                                    {year}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Selected: <strong>{dayjs(`${exportYear}-${exportMonth}-01`).format('MMMM YYYY')}</strong>
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                
                <Divider />
                
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={() => setExportDialogOpen(false)}
                        variant="outlined"
                        color="inherit"
                        disabled={isExporting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleExportAnyMonth} 
                        disabled={isExporting}
                        variant="contained"
                        startIcon={isExporting ? <CircularProgress size={20} /> : <Download />}
                        sx={{ minWidth: 120 }}
                    >
                        {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );   
};

export default TimeData;