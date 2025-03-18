import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import React, { useState, useEffect, useContext } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem, DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TimeClock, DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
    Box,
    Grid,
    Card,
    Stack,
    Radio,
    Select,
    Button,
    Divider,
    MenuItem,
    TextField,
    CardHeader,
    InputLabel,
    RadioGroup,
    CardContent,
    FormControl,
    FormControlLabel,
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
    billableStatus: 'Billable',
    totalHours: '',
    startTime: null,
    endTime: null,
    selectedTimeMode: 'manual',
    timer: 0,
    timerRunning: false,
};

export default function StageCreateForm() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const [intervalId, setIntervalId] = useState(null);
    const [values, setValue] = React.useState(dayjs('2022-04-17T15:30'));
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClose = () => navigate(paths.main.timesheet.root);
    const [projects, setProjects] = useState([]);

    const handleSubmit = async () => {
        const payload = {
            project_name: formData.projectName,
            employee_id: user.employee_id,
            job_name: formData.jobName,
            work_item: formData.workItem,
            description: formData.description,
            total_hours: formData.totalHours || calculateDuration(),
        };

        try {
            const response = await axiosInstance.post(endpoints.timesheet.create, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status) {
                toast.success('Timesheet submitted successfully!');
                navigate(paths.main.timesheet.root);
            }
        } catch (error) {
            toast.error('Failed to submit timesheet. Please try again.');
        }
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleTimeModeChange = (event) => {
        setFormData({ ...formData, selectedTimeMode: event.target.value });
    };
    const calculateDuration = () => {
        if (formData.startTime && formData.endTime) {
            const duration = dayjs(formData.endTime).diff(dayjs(formData.startTime), 'minute');
            const hours = String(Math.floor(duration / 60)).padStart(2, '0');
            const minutes = String(duration % 60).padStart(2, '0');

            return `${hours}:${minutes}`;
        }
        return '00:00';
    };

    useEffect(() => {
        if (formData.startTime && formData.endTime) {
            const newDuration = calculateDuration();

            setFormData((prev) => {
                if (prev.totalHours !== newDuration) {
                    return { ...prev, totalHours: newDuration };
                }
                return prev;
            });
        }
        // eslint-disable-next-line
    }, [formData.startTime, formData.endTime]);

    return (
        <Card sx={{ mx: 'auto', width: '80%' }}>
            <CardHeader
                title="Create Timesheet"
                subheader="Fill in the details below"
                sx={{ mb: 3 }}
            />
            <Divider />
            <CardContent>
                <Stack gap={3} padding={3}>
                    <FormControl fullWidth>
                        <InputLabel>Project Name</InputLabel>
                        <Select
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.project_id} value={project.project_name}>
                                    {project.project_name}
                                </MenuItem>
                            ))}
                            <MenuItem value="Project management Tool">
                                Project management Tool
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Job Name</InputLabel>
                        <Select
                            name="jobName"
                            value={formData.jobName}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Frontend and Backend">Frontend and Backend</MenuItem>
                            <MenuItem value="AI and ML training and development">
                                AI and ML training and development
                            </MenuItem>
                            <MenuItem value="API Service Testing">API Service Testing</MenuItem>
                            <MenuItem value="Kiosk Integration">Kiosk Integration</MenuItem>
                            <MenuItem value="MDM Development">MDM Development</MenuItem>
                            <MenuItem value="Middle Layer and Backend Development">
                                Middle Layer and Backend Development
                            </MenuItem>
                            <MenuItem value="Payrastra">Payrastra</MenuItem>
                            <MenuItem value="Trueread Analysis">Trueread Analysis</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        name="workItem"
                        label="Work Item"
                        variant="outlined"
                        value={formData.workItem}
                        onChange={handleInputChange}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            value={formData.selectedTimeMode}
                            onChange={handleTimeModeChange}
                        >
                            <FormControlLabel
                                value="manual"
                                control={<Radio />}
                                label="Total Hours"
                            />
                            <FormControlLabel
                                value="startEnd"
                                control={<Radio />}
                                label="Start & End Time"
                            />
                        </RadioGroup>
                    </FormControl>

                    {formData.selectedTimeMode === 'manual' && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack direction="column" alignItems="center" spacing={0.1}>
                                <Box sx={{ transform: 'scale(0.8)' }}>
                                    <DemoContainer components={['TimeClock', 'TimeClock']}>
                                        <DemoItem>
                                            <TimeClock
                                                value={
                                                    formData.totalHours
                                                        ? dayjs(formData.totalHours, 'HH:mm')
                                                        : null
                                                }
                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        const formattedTime =
                                                            newValue.format('HH:mm');
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            totalHours: formattedTime,
                                                        }));
                                                    }
                                                }}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </Box>
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 45,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        backgroundColor: '#f5f5f5',
                                        fontSize: '18px',
                                    }}
                                >
                                    {formData.totalHours || ' HH : mm'}
                                </Box>
                            </Stack>
                        </LocalizationProvider>
                    )}

                    {formData.selectedTimeMode === 'startEnd' && (
                        <Stack direction="row" gap={2}>
                            <TimePicker
                                label="Start Time"
                                value={formData.startTime}
                                onChange={(newValue) => handleDateChange('startTime', newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                            <TimePicker
                                label="End Time"
                                value={formData.endTime}
                                onChange={(newValue) => handleDateChange('endTime', newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                            <TextField
                                label="Duration"
                                value={formData.totalHours}
                                disabled
                                fullWidth
                            />
                        </Stack>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Stack direction="row" gap={2}>
                                <DatePicker
                                    label="Date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={(newValue) => handleDateChange('startDate', newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: params.InputProps?.endAdornment,
                                            }}
                                        />
                                    )}
                                    sx={{ flexGrow: 1 }}
                                />
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Billable Status</InputLabel>
                                <Select
                                    name="billableStatus"
                                    value={formData.billableStatus}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Billable">Billable</MenuItem>
                                    <MenuItem value="Non-Billable">Non-Billable</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Stack>
                <Box display="flex" justifyContent="flex-end">
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="success" onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}
