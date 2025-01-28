import dayjs from 'dayjs';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import {
    Box,
    Grid,
    Button,
    Dialog,
    Select,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    DialogTitle,
    FormControl,
    DialogActions,
    DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

export default function EditDateDialog({ open, onClose, setOpenEditDialog, items, sprintData, getSprints }) {
    const currentSprint = sprintData.find((sprint) => sprint.sprintId === items);
    const [error, setError] = useState(false);
    const { control, setValue } = useForm();
    const [startDateTouched, setStartDateTouched] = useState(false);
    const loading = useBoolean();
    const [sprintName, setSprintName] = useState(currentSprint?.sprintName || 'Sprint');
    const [description, setDescription] = useState(currentSprint?.description || '');
    const [startDateTime, setStartDateTime] = useState(dayjs(currentSprint?.startDate) || null);
    const [endDateTime, setEndDateTime] = useState(dayjs(currentSprint?.endDate) || null);
    const [duration, setDuration] = useState('Custom');

    // Find the specific sprint by ID

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    const handleStartDateChange = (date) => {
        setStartDateTouched(true);
        setStartDateTime(date);
        setValue('start', date);
        validateDates(date, endDateTime);
    };

    const handleEndDateChange = (date) => {
        setEndDateTime(date);
        setValue('end', date);
        validateDates(startDateTime, date);
    };

    const validateDates = (startDate, endDate) => {
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleUpdateSprint = async () => {
        
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
        setOpenEditDialog(false);
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

                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="duration-select-label">Duration</InputLabel>
                            <Select
                                labelId="duration-select-label"
                                id="duration-select"
                                label="Duration"
                                variant="outlined"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <MenuItem value="week1">1 Week</MenuItem>
                                <MenuItem value="week2">2 Weeks</MenuItem>
                                <MenuItem value="week3">3 Weeks</MenuItem>
                                <MenuItem value="week4">4 Weeks</MenuItem>
                                <MenuItem value="Custom">Custom</MenuItem>
                            </Select>
                        </FormControl>

                        <Controller
                            name="start"
                            control={control}
                            render={({ field }) => (
                                <MobileDateTimePicker
                                    {...field}
                                    value={startDateTime}
                                    onChange={handleStartDateChange}
                                    // onChange={(newValue) => setStartDateTime(newValue)}
                                    label="Start Date"
                                    format="DD/MM/YY hh:mm A"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: startDateTouched && !startDateTime,
                                        },
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="end"
                            control={control}
                            render={({ field }) => (
                                <MobileDateTimePicker
                                    {...field}
                                    value={endDateTime}
                                    onChange={handleEndDateChange}
                                    label="End Date"
                                    format="DD/MM/YY hh:mm A"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error, // Show error style
                                            helperText: error
                                                ? 'End date must be later than start date' // Dynamic message
                                                : '',
                                        },
                                    }}
                                    disabled={duration !== 'Custom'} 
                                />
                            )}
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
                    onClick={handleUpdateSprint}
                >
                    Update
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
