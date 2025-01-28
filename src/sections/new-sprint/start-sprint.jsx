import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import {
    Box,
    Grid,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Typography,
    FormControl,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

export default function StartSprint({
    open,
    onClose,
    items,
    setOpen,
    getSprints,
    sprintData,
    setBool,
}) {
    const currentSprint = sprintData.find((sprint) => sprint.sprintId === items);
    const [duration, setDuration] = useState('Custom');
    const [startDateTime, setStartDateTime] = useState();
    const [endDateTime, setEndDateTime] = useState();
    const [sprintName, setSprintName] = useState();
    const [error, setError] = useState(false);
    const { control, setValue } = useForm();
    const [startDateTouched, setStartDateTouched] = useState(false);
    const [description, setDescription] = useState(currentSprint?.description || '');
    const loading = useBoolean();
    console.log('currentSprint>>', currentSprint);

    useEffect(() => {
        if (currentSprint) {
            setSprintName(currentSprint.sprintName || '');
            setStartDateTime(dayjs(currentSprint.startDate) || null);
            setEndDateTime(dayjs(currentSprint.endDate) || null);
        }
    }, [currentSprint]);

    const handleStartDateChange = (date) => {
        setStartDateTouched(true);
        setStartDateTime(date);

        // Update end date if duration is not custom
        if (duration !== 'Custom') {
            const weeks = parseInt(duration.replace('week', ''), 10);
            const calculatedEndDate = dayjs(date).add(weeks, 'week'); // Ensure this is a dayjs object
            setEndDateTime(calculatedEndDate);
        }

        validateDates(date, endDateTime);
    };

    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setDuration(selectedDuration);

        // Update end date based on duration if startDateTime exists
        if (startDateTime && selectedDuration !== 'Custom') {
            const weeks = parseInt(selectedDuration.replace('week', ''), 10);
            const calculatedEndDate = dayjs(startDateTime).add(weeks, 'week'); // Ensure this is a dayjs object
            setEndDateTime(calculatedEndDate);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDateTime(date);
        validateDates(startDateTime, date);
    };

    const validateDates = (startDate, endDate) => {
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleUpdate = async () => {
        const dataToSend = {
            sprint_id: currentSprint?.sprintId,
            name: sprintName,
            description,
            start_date: startDateTime?.format('YYYY-MM-DD HH:mm:ss'),
            end_date: endDateTime?.format('YYYY-MM-DD HH:mm:ss'),
        };

        try {
            loading.onTrue();
            const response = await axiosInstance.put(endpoints.sprints.update, dataToSend);

            const { message, errors, status } = response.data;

            if (status === true) {
                toast.success('Sprint updated successfully!');
                getSprints();
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to process');
        } finally {
            loading.onFalse();
        }
        setBool(false);
    };

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { maxWidth: 550 },
            }}
        >
            <DialogTitle id="alert-dialog-title" variant="bold" fontSize={20}>
                Edit: {currentSprint?.sprintName || 'Sprint'}
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle2" sx={{ mb: 3 }}>
                    Required fields are marked with an asterisk
                </Typography>
                <Grid container spacing={2}>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            width: '100%',
                            p: 3,
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                        }}
                    >
                        <TextField
                            required
                            id="sprint-name"
                            label="Sprint Name"
                            variant="outlined"
                            value={sprintName}
                            onChange={(e) => setSprintName(e.target.value)}
                        />

                        {/* Duration Selector */}
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="duration-select-label">Duration</InputLabel>
                            <Select
                                labelId="duration-select-label"
                                id="duration-select"
                                label="Duration"
                                variant="outlined"
                                value={duration}
                                onChange={handleDurationChange}
                            >
                                <MenuItem value="week1">1 Week</MenuItem>
                                <MenuItem value="week2">2 Weeks</MenuItem>
                                <MenuItem value="week3">3 Weeks</MenuItem>
                                <MenuItem value="week4">4 Weeks</MenuItem>
                                <MenuItem value="Custom">Custom</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Start Date Picker */}
                        <MobileDateTimePicker
                            value={startDateTime}
                            onChange={handleStartDateChange}
                            label="Start Date"
                            format="DD/MM/YY hh:mm A"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: startDateTouched && !startDateTime,
                                },
                            }}
                        />

                        {/* End Date Picker */}
                        <MobileDateTimePicker
                            value={endDateTime}
                            onChange={handleEndDateChange}
                            label="End Date"
                            format="DD/MM/YY hh:mm A"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error,
                                    helperText: error
                                        ? 'End date must be later than start date'
                                        : '',
                                },
                            }}
                            disabled={duration !== 'Custom'}
                        />

                        <TextField
                            name="subDescription"
                            label="Other Details"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <LoadingButton
                    type="submit"
                    loading={loading.value}
                    variant="contained"
                    disabled={error}
                    onClick={handleUpdate}
                >
                    Save
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
