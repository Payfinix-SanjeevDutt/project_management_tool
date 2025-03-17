import dayjs from 'dayjs';
import React, { useState } from 'react';

import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
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
            return `${Math.floor(duration / 60)}h ${duration % 60}m`;
        }
        return '00:00';
    };

    const startTimer = () => {
        if (!formData.timerRunning) {
            const id = setInterval(() => {
                setFormData((prev) => ({ ...prev, timer: prev.timer + 1 }));
            }, 1000);
            setIntervalId(id);
            setFormData((prev) => ({ ...prev, timerRunning: true }));
        }
    };

    const stopTimer = () => {
        clearInterval(intervalId);
        setFormData((prev) => ({ ...prev, timerRunning: false }));
    };

    const resetTimer = () => {
        clearInterval(intervalId);
        setFormData((prev) => ({ ...prev, timer: 0, timerRunning: false }));
    };

    const formatTimer = () => {
        const hours = Math.floor(formData.timer / 3600);
        const minutes = Math.floor((formData.timer % 3600) / 60);
        const seconds = formData.timer % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Card sx={{ mx: 'auto', width: '80%' }}>
            <CardHeader
                title="Create Timesheet"
                subheader="Fill in the details below"
                sx={{ mb: 3 }}
            />
            <Divider />
            <CardContent>
                <Stack gap={3}>
                    <FormControl fullWidth>
                        <InputLabel>Project Name</InputLabel>
                        <Select
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Project A">Project A</MenuItem>
                            <MenuItem value="Project B">Project B</MenuItem>
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
                            <MenuItem value="Job A">Job A</MenuItem>
                            <MenuItem value="Job B">Job B</MenuItem>
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
                            <FormControlLabel value="timer" control={<Radio />} label="Timer" />
                        </RadioGroup>
                    </FormControl>

                    {formData.selectedTimeMode === 'manual' && (
                        <TextField
                            fullWidth
                            name="totalHours"
                            label="Total Hours"
                            variant="outlined"
                            value={formData.totalHours}
                            onChange={handleInputChange}
                        />
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
                                value={calculateDuration()}
                                disabled
                                fullWidth
                            />
                        </Stack>
                    )}

                    {formData.selectedTimeMode === 'timer' && (
                        <Stack direction="row" gap={2} alignItems="center">
                            <TextField label="Timer" value={formatTimer()} disabled fullWidth />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={startTimer}
                                disabled={formData.timerRunning}
                            >
                                Start
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={stopTimer}
                                disabled={!formData.timerRunning}
                            >
                                Stop
                            </Button>
                            <Button variant="outlined" color="error" onClick={resetTimer}>
                                Reset
                            </Button>
                        </Stack>
                    )}

                    <DatePicker
                        label="Date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth variant="outlined" />
                        )}
                    />

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
                    
                    <Button className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">
                        Cancel
                    </Button>

                </Stack>
            </CardContent>
        </Card>
    );
}
