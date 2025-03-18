import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import React, { useState, useEffect, useContext } from 'react';

import { DatePicker } from '@mui/x-date-pickers';
import { Stack, Alert, MenuItem, Snackbar, TextField, Autocomplete } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { AuthContext } from 'src/auth/context/auth-context';

const Sidebar = ({ task, HandleTaskChanges }) => {
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [actualEndDate, setActualEndDate] = useState(task.actual_end_date || null);
    const { employees } = useSelector((state) => state.assignee);
    const { user } = useContext(AuthContext);
    const reporter_info = employees[task.reporter_id];
    const assignee_info = employees[task.assignee_id];
    const loggedInEmployee = employees[user.employee_id]; 
    const userRole = loggedInEmployee ? loggedInEmployee.role : null;
    const isAdmin = userRole && ['admin', 'Admin', 'ADMIN'].includes(userRole);

    useEffect(() => {
        setActualEndDate(task.actual_end_date || null);
    }, [task.actual_end_date]);

    return (
        <Stack gap={2} sx={{ mt: 2 }}>
            <Stack direction="row" gap={12} alignItems="center">
                <TextField
                    select
                    label="Status"
                    variant="outlined"
                    fullWidth
                    disabled={!isAdmin}
                    value={task.status || ''}
                    onChange={(e) => {
                        const newStatus = e.target.value;

                        if (newStatus === 'DONE') {
                            if (!task.actual_start_date) {
                                setError(
                                    'Actual start date is required before setting status to Done.'
                                );
                                setOpenSnackbar(true);
                                return;
                            }
                            if (!actualEndDate) {
                                setError('Actual end date is required when status is set to Done.');
                                setOpenSnackbar(true);
                                return;
                            }
                        }

                        if (newStatus === 'IN_PROGRESS' && !task.actual_start_date) {
                            setError(
                                'Actual start date is required before setting status to In Progress.'
                            );
                            setOpenSnackbar(true);
                            return;
                        }

                        setError('');
                        HandleTaskChanges({
                            name: 'status',
                            value: newStatus,
                        });
                    }}
                >
                    <MenuItem value="TODO">To do</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="DONE">Done</MenuItem>
                </TextField>
            </Stack>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Stack gap={1.5}>
                <TextField
                    select
                    label="Priority"
                    variant="outlined"
                    fullWidth
                    value={task.priority || ''}
                    disabled={!isAdmin}
                    onChange={(e) => HandleTaskChanges({ name: 'priority', value: e.target.value })}
                >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                </TextField>

                <Autocomplete
                    options={Object.values(employees)}
                    getOptionLabel={(option) => (option?.name ? option.name : '')}
                    value={reporter_info || null}
                    onChange={(e, selectedOption) => {
                        HandleTaskChanges({
                            name: 'reporter_id',
                            value: selectedOption ? selectedOption.id : null,
                        });
                    }}
                    disabled={!isAdmin}
                    renderInput={(params) => <TextField {...params} label="Creator" />}
                />

                <Autocomplete
                    options={Object.values(employees)}
                    name="Assignee"
                    value={assignee_info || null}
                    getOptionLabel={(option) => (option?.name ? option.name : '')}
                    onChange={(e, selectedOption) => {
                        HandleTaskChanges({
                            name: 'assignee_id',
                            value: selectedOption ? selectedOption.id : null,
                        });
                    }}
                    disabled={!isAdmin}
                    renderInput={(params) => <TextField {...params} fullWidth label="Assignee" />}
                />

                <DatePicker
                label="Start Date"
                    value={task.start_date ? dayjs(task.start_date) : null}
                    onChange={(date) =>
                        isAdmin && HandleTaskChanges({ name: 'start_date', value: fDate(date) })
                    }
                    disabled={!isAdmin}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth disabled={!isAdmin} />
                    )}
                />

                <DatePicker
                    label="End Date"
                    value={task.end_date ? dayjs(task.end_date) : null}
                    onChange={(date) => {
                        if (
                            isAdmin &&
                            (!task.start_date || dayjs(date).isAfter(dayjs(task.start_date)))
                        ) {
                            HandleTaskChanges({ name: 'end_date', value: fDate(date) });
                        }
                    }}
                    minDate={task.start_date ? dayjs(task.start_date) : null}
                    disabled={!isAdmin}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth disabled={!isAdmin} />
                    )}
                />

                <DatePicker
                    label="Actual Start Date"
                    value={task.actual_start_date ? dayjs(task.actual_start_date) : null}
                    onChange={(date) => {
                        if (!date) return;

                        const selectedDate = fDate(date);

                        if (isAdmin) {
                            HandleTaskChanges({ name: 'actual_start_date', value: selectedDate });
                        }

                        setError('');
                    }}
                    minDate={task.start_date ? dayjs(task.start_date) : null}
                    disabled={!isAdmin}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth disabled={!isAdmin} />
                    )}
                />

                <DatePicker
                    label="Actual End Date"
                    value={actualEndDate ? dayjs(actualEndDate) : null}
                    onChange={(date) => {
                        if (!date) {
                            setError('Actual End Date is required.');
                            setOpenSnackbar(true);
                            return;
                        }

                        if (
                            task.actual_start_date &&
                            dayjs(date).isBefore(dayjs(task.actual_start_date))
                        ) {
                            setError(
                                'Actual End Date must be the same as or after the Actual Start Date.'
                            );
                            setOpenSnackbar(true);
                            return;
                        }

                        const formattedDate = fDate(date);
                        setActualEndDate(formattedDate);
                        if (isAdmin) {
                            HandleTaskChanges({ name: 'actual_end_date', value: formattedDate });
                        }
                        setError('');
                    }}
                    minDate={
                        task.actual_start_date
                            ? dayjs(task.actual_start_date)
                            : task.start_date
                              ? dayjs(task.start_date)
                              : null
                    }
                    disabled={!isAdmin}
                    renderInput={(params) => (
                        <TextField {...params} fullWidth disabled={!isAdmin} />
                    )}
                />

                <TextField
                    placeholder="Sprint ID"
                    variant="outlined"
                    fullWidth
                    value={task.sprint_id || ''}
                    InputProps={{ readOnly: true }}
                />
            </Stack>
        </Stack>
    );
};

export default Sidebar;
