import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router';
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
    billableStatus: 'BILLABLE',
    totalHours: '',
    startTime: null,
    endTime: null,
    selectedTimeMode: 'startEnd',
};

export default function StageCreateForm() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClose = () => navigate(paths.main.timesheet.root);
    const [projects, setProjects] = useState([]);
    const { timesheetId, employeeId } = useParams();
    const handleSubmit = async () => {
        if (!formData.projectName.trim()) {
            toast.error('Project Name is required.');
            return;
        }

        if (!formData.workItem.trim()) {
            toast.error('Task is required.');
            return;
        }
        if (!formData.startDate) {
            toast.error('Start Date is required.');
            return;
        }
        if (formData.selectedTimeMode === 'manual' && !formData.totalHours) {
            toast.error('Total Hours is required.');
            return;
        }
        if (
            formData.selectedTimeMode === 'startEnd' &&
            (!formData.startTime || !formData.endTime)
        ) {
            toast.error('Start Time and End Time are required.');
            return;
        }
        const payload = {
            timesheet_id: timesheetId,
            project_name: formData.projectName,
            employee_id: user.employee_id,
            job_name: formData.jobName,
            work_item: formData.workItem,
            description: formData.description,
            total_hours: formData.totalHours || calculateDuration(),
            startDate: formData.startDate,
            billable_status: formData.billableStatus,
        };

        try {
            let response;
            if (timesheetId) {
                response = await axiosInstance.post(`${endpoints.timesheet.update}`, payload);
            } else {
                response = await axiosInstance.post(endpoints.timesheet.create, payload);
            }

            if (response.status) {
                toast.success(`Timesheet ${timesheetId ? 'updated' : 'submitted'} successfully!`);
                navigate(paths.main.timesheet.root);
            }
        } catch (error) {
            toast.error(`Failed to ${timesheetId ? 'update' : 'submit'} timesheet.`);
        }
    };

    useEffect(() => {
        if (timesheetId) {
            axiosInstance
                .post(endpoints.timesheet.getsingleTimesheet, {
                    timesheet_id: timesheetId,
                    employee_id: employeeId,
                })
                .then((response) => {
                    if (response.data.status) {
                        const { data } = response.data;
                        setFormData({
                            projectName: data.project_name,
                            jobName: data.job_name,
                            workItem: data.work_item,
                            description: data.description,
                            startDate: dayjs(data.startDate),
                            billableStatus: data.billable_status,
                            totalHours: data.total_hours,
                            startTime: data.startTime ? dayjs(data.startTime) : null,
                            endTime: data.endTime ? dayjs(data.endTime) : null,
                            selectedTimeMode:
                                data.startTime && data.endTime ? 'startEnd' : 'manual',
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching timesheet:', error);
                    toast.error('Failed to load timesheet.');
                });
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.post(endpoints.project.list, {
                    employee_id: user.employee_id,
                });
                const projectsArray = response.data.data;
                setProjects(Array.isArray(projectsArray) ? projectsArray : []);
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
        <Card sx={{ mx: 'auto', my: 'auto', width: '80%' }}>
            <CardHeader
                title="Create Timesheet"
                subheader="Fill in the details below"
                sx={{ mb: 3 }}
            />
            <Divider />
            <CardContent>
                <Stack gap={3} padding={3}>
                    <FormControl fullWidth>
                        <InputLabel>Project</InputLabel>
                        <Select
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.name}>
                                    {project.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        name="workItem"
                        label="Task"
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
                                    <MenuItem value="BILLABLE">Billable</MenuItem>
                                    <MenuItem value="NON-BILLABLE">Non-Billable</MenuItem>
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
