import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router';
import React, { useMemo, useState, useEffect, useContext } from 'react';

import { ArrowBack, ArrowForward, CalendarToday } from '@mui/icons-material';
import {
    Box,
    Table,
    Paper,
    Button,
    Select,
    Tooltip,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    Typography,
    IconButton,
    FormControl,
    TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { AuthContext } from 'src/auth/context/auth-context';

const INITIAL_STATE = {
    projectName: '',
    jobName: '',
    workItem: '',
    description: '',
    startDate: dayjs(),
    billableStatus: 'BILLABLE',
    totalHours: '',
    startTime: null,
    endTime: null,
    selectedTimeMode: 'startEnd',
};

const TimeLogTable = () => {
    const [rows, setRows] = useState([1, 2, 3, 4, 5]);
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('week'));
    const navigate = useNavigate();
    const [showArrows, setShowArrows] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { timesheetId, employeeId } = useParams();
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const startOfWeek = useMemo(() => selectedDate.startOf('week'), [selectedDate]);
    const endOfWeek = useMemo(() => selectedDate.endOf('week'), [selectedDate]);

    const handleCancel = () => navigate(paths.main.timesheet.root);

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
    };

    const getWeekDates = (startDate) =>
        Array.from({ length: 7 }, (_, i) => dayjs(startDate).add(i, 'day').format('MMM DD ddd'));

    const changeWeek = (offset) => {
        setLoading(true);
        setSelectedDate((prevDate) => prevDate.add(offset, 'week').startOf('week'));
        setTimeout(() => setLoading(false), 1000);
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get(endpoints.project.project_stage_report);
                const projectsArray = Array.isArray(response.data)
                    ? response.data
                    : response.data.projects;
                setProjects(projectsArray || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
                toast.error('Failed to load projects.');
            }
        };
        fetchProjects();
        // eslint-disable-next-line
    }, []);

    const handleRowChange = (e, rowIndex, dayIndex = null) => {
        const { name, value } = e.target;
    
        setFormData((prev) => {
            const updatedRow = {
                ...prev[rowIndex],
                [name.split('-')[0]]: value, 
            };
    
            if (dayIndex !== null && !Number.isNaN(dayIndex)) {
                updatedRow.times = {
                    ...(prev[rowIndex]?.times || {}),
                    [dayIndex]: value, 
                };
            }
    
            return {
                ...prev,
                [rowIndex]: updatedRow,
            };
        });
    };
    
    

    const handleSubmit = async () => {
        console.log("Submitting formData:", JSON.stringify(formData, null, 2)); 
    
        const weekStartDate = selectedDate.startOf('week'); 
    
        const payload = Object.entries(formData).flatMap(([rowIndex, rowData]) =>
            Object.entries(rowData?.times || {})
                .filter(([dayIndex]) => !Number.isNaN(dayIndex)) 
                .map(([dayIndex, hours]) => ({
                    project_name: rowData?.projectName || '',
                    employee_id: user.employee_id,
                    job_name: rowData?.jobName || '',
                    work_item: rowData?.workItem || '',
                    description: rowData?.description || '',
                    billable_status: rowData?.billableStatus || 'BILLABLE',
                    total_hours: hours || '0:00',
                    startDate: weekStartDate.add(Number(dayIndex), 'day').format('YYYY-MM-DD'),
                }))
        );
        
    
        console.log("Final Payload:", JSON.stringify(payload, null, 2)); 
    
        try {
            const response = await axiosInstance.post(endpoints.timesheet.create, payload);
    
            if (response.status) {
                toast.success(`Timesheet ${timesheetId ? 'updated' : 'submitted'} successfully!`);
                navigate(paths.main.timesheet.root);
            }
        } catch (error) {
            toast.error(`Failed to ${timesheetId ? 'update' : 'submit'} timesheet.`);
        }
    };
    
    
    return (
        <Box p={3}>
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: 4 },
                    maxWidth: 500,
                    justifyContent: 'center',
                    margin: '0 auto',
                    textAlign: 'center',
                }}
                onMouseEnter={() => setShowArrows(true)}
                onMouseLeave={() => setShowArrows(true)}
            >
                {showArrows && (
                    <Tooltip title="Previous Week">
                        <IconButton onClick={() => changeWeek(-1)} size="small">
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>
                )}
                <Typography variant="body1" fontWeight={500}>
                    {startOfWeek.format('DD-MMM-YYYY')}
                </Typography>

                <CalendarToday fontSize="small" color="primary" />

                <Typography variant="body1" fontWeight={500}>
                    {endOfWeek.format('DD-MMM-YYYY')}
                </Typography>

                {showArrows && (
                    <Tooltip title="Next Week">
                        <IconButton onClick={() => changeWeek(1)} size="small">
                            <ArrowForward />
                        </IconButton>
                    </Tooltip>
                )}
            </Paper>

            <TableContainer component={Paper} sx={{ mt: 5, borderRadius: 2, overflowX: 'auto' }}>
                <Table sx={{ minWidth: 2000 }}>
                    {' '}
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: 50 }}>S.No</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 250 }}>Project</TableCell>
                            {/* <TableCell sx={{ fontWeight: 600, width: 250 }}>Job Name</TableCell> */}
                            <TableCell sx={{ fontWeight: 600, width: 200 }}>Task</TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    width: 300,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                Description
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, width: 150 }}>
                                Billable Status
                            </TableCell>
                            {getWeekDates(selectedDate).map((day, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        minWidth: 120,
                                        backgroundColor:
                                            index === 0 || index === 6 ? '#fdf2d1' : 'transparent',
                                    }}
                                >
                                    {day}
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 600, width: 100 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>

                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name={`projectName-${index}`}
                                            value={formData[index]?.projectName || ''}
                                            onChange={(e) => handleRowChange(e, index)}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            {projects.map((project) => (
                                                <MenuItem
                                                    key={project.project_id}
                                                    value={project.project_name}
                                                >
                                                    {project.project_name}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="Project management Tool">
                                                Project management Tool
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
{/* 
                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name={`jobName-${index}`}
                                            value={formData[index]?.jobName || ''}
                                            onChange={(e) => handleRowChange(e, index)}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="Frontend and Backend">
                                                Frontend and Backend
                                            </MenuItem>
                                            <MenuItem value="AI and ML training and development">
                                                AI and ML training and development
                                            </MenuItem>
                                            <MenuItem value="API Service Testing">
                                                API Service Testing
                                            </MenuItem>
                                            <MenuItem value="Kiosk Integration">
                                                Kiosk Integration
                                            </MenuItem>
                                            <MenuItem value="MDM Development">
                                                MDM Development
                                            </MenuItem>
                                            <MenuItem value="Middle Layer and Backend Development">
                                                Middle Layer and Backend Development
                                            </MenuItem>
                                            <MenuItem value="Payrastra">Payrastra</MenuItem>
                                            <MenuItem value="Trueread Analysis">
                                                Trueread Analysis
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell> */}

                                <TableCell>
                                    <TextField
                                        fullWidth
                                        name={`workItem-${index}`}
                                        label="Task "
                                        variant="outlined"
                                        value={formData[index]?.workItem || ''}
                                        onChange={(e) => handleRowChange(e, index)}
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        variant="outlined"
                                        name={`description-${index}`}
                                        value={formData[index]?.description || ''}
                                        onChange={(e) => handleRowChange(e, index)}
                                    />
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            name={`billableStatus-${index}`}
                                            value={formData[index]?.billableStatus || 'Billable'}
                                            size="small"
                                            onChange={(e) => handleRowChange(e, index)}
                                        >
                                            <MenuItem value="Billable">Billable</MenuItem>
                                            <MenuItem value="Non-Billable">Non-Billable</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                {Array.from({ length: 7 }).map((_, i) => (
                                    <TableCell
                                        key={i}
                                        sx={{
                                            textAlign: 'center',
                                            minWidth: 120,
                                            backgroundColor:
                                                i === 0 || i === 6 ? '#fdf2d1' : 'transparent',
                                        }}
                                    >
                                        {i === 0 || i === 6 ? (
                                            <Typography sx={{ fontSize: '0.9rem', color: 'gray' }}>
                                                --
                                            </Typography>
                                        ) : (
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                name={`time-${index}-${i+1}`}
                                                value={formData[index]?.times?.[i] || '00:00'}
                                                onChange={(e) => handleRowChange(e, index, i)}
                                            />
                                        )}
                                    </TableCell>
                                ))}

                                <TableCell sx={{ textAlign: 'center' }}>00:00</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3}>
                <Button variant="contained" onClick={addRow}>
                    Add Row
                </Button>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
                p={2}
                bgcolor="#fff"
                borderRadius={2}
            >
                <Box>
                    {[].map((item, idx) => (
                        <Typography
                            key={idx}
                            variant="body2"
                            sx={{ color: item.color, display: 'inline', mr: 2 }}
                        >
                            {item.label}
                        </Typography>
                    ))}
                </Box>

                <Box display="flex" gap={1}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={() => setFormData(INITIAL_STATE)}>
                        Reset
                    </Button>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};


export default TimeLogTable;
