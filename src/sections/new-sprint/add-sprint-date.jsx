import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

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

import { toast } from 'src/components/snackbar';

export default function AddDateDialog({
    open,
    onClose,
    items,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    setOpen,
    sprintid,
    setCurrentSprintId,
    getSprints,
}) {
    const [duration, setDuration] = useState('Custom');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { control, setValue } = useForm();
    const loading = useBoolean();
    const [startDateTouched, setStartDateTouched] = useState(false);
    console.log('startDateTime', startDateTime);
    console.log('open', open);

    // const handleDurationChange = (event) => {
    //     setDuration(event.target.value);
    // };

    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setDuration(selectedDuration);
    
        if (selectedDuration.startsWith('week')) {
            const weeks = parseInt(selectedDuration.replace('week', ''), 10);
            if (startDateTime) {
                const newEndDate = dayjs(startDateTime).add(weeks, 'week').toDate();
                setEndDateTime(newEndDate); // Update endDateTime
            }
        } else if (selectedDuration === 'Custom') {
            setEndDateTime(null); // Allow manual input for endDateTime
        }
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

    // When you need to send the date in a specific format:
    const formattedStartDate = startDateTime ? startDateTime.format('DD-MM-YY hh:mm A') : '';
    const formattedEndDate = endDateTime ? endDateTime.format('DD-MM-YY hh:mm A') : '';

    const validateDates = (startDate, endDate) => {
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const updateDate = async () => {
        
        const sprintPayload = {
            sprint_id: sprintid,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
        };  
        
        try {
            loading.onTrue();
            const response = await axiosInstance.put(endpoints.sprints.addDate, sprintPayload);
            console.log('response???', response);

            const { message, errors, data, status } = response.data;

            if (status === true) {
                onClose(data); // Pass the updated sprint data to the parent
                setCurrentSprintId(null);
                toast.success(message); 
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
        setOpen(false);
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
            <DialogTitle id="alert-dialog-title">Edit sprint:{items}</DialogTitle>
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
                        {/* <Typography variant="subtitle2">Sprint Name</Typography> */}
                        <TextField
                            required
                            id="outlined-required"
                            label="Sprints"
                            variant="outlined"
                            defaultValue={items}
                        />
                        {/* <Typography variant="subtitle2">Duration</Typography> */}
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="platform-type-select-label">Duration</InputLabel>
                            <Select
                                labelId="platform-type-select-label"
                                id="device-select"
                                label="Duration"
                                variant="outlined"
                                value={duration}
                                onChange={handleDurationChange}
                            >
                                <MenuItem value="week1">1 Week</MenuItem>
                                <MenuItem value="week2">2 Week</MenuItem>
                                <MenuItem value="week3">3 Week</MenuItem>
                                <MenuItem value="week4">4 Week</MenuItem>
                                <MenuItem value="Custom">Custom</MenuItem>
                            </Select>
                        </FormControl>

                        {/* <Typography variant="subtitle2">Start Date</Typography> */}
                        <Controller
                            name="start"
                            control={control}
                            render={({ field }) => (
                                <MobileDateTimePicker
                                    {...field}
                                    value={dayjs(startDateTime)}
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
                            )}
                        />

                        {/* <Typography variant="subtitle2">End Date</Typography> */}
                        <Controller
                            name="end"
                            control={control}
                            render={({ field }) => (
                                <MobileDateTimePicker
                                    {...field}
                                    value={dayjs(endDateTime)}
                                    onChange={handleEndDateChange}
                                    label="End Date"
                                    format="DD/MM/YY hh:mm A"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error,
                                            helperText:
                                                error && 'End date must be later than start date',
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
                    onClick={updateDate}
                >
                    Update
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
