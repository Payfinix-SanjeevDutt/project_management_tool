import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { DatePicker } from '@mui/x-date-pickers';
import { Stack, MenuItem, TextField, Autocomplete } from '@mui/material';

import { fDate } from 'src/utils/format-time';

const Sidebar = ({ task, HandleTaskChanges }) => {
    const [loading, setLoading] = useState(false);
    const {employees} = useSelector((state)=>state.assignee)

    const reporter_info = employees[task.reporter_id]
    const assignee_info = employees[task.assignee_id]

    return (
        <Stack gap={2} sx={{mt:2}}>
            <Stack direction="row" gap={12} alignItems="center">
                <TextField
                    select
                    label="Status"
                    variant="outlined"
                    fullWidth
                    value={task.status || ''}
                    onChange={(e) =>
                        HandleTaskChanges({
                            name: 'status',
                            value: e.target.value,
                        })
                    }
                >
                    <MenuItem value="TODO">To do</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="DONE">Done</MenuItem>
                </TextField>
            </Stack>

            <Stack gap={1.5}>
                <TextField
                    select
                    label="Priority"
                    variant="outlined"
                    fullWidth
                    value={task.priority || ''}
                    onChange={(e) => HandleTaskChanges({ name: 'priority', value: e.target.value })}
                >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                </TextField>

                <Autocomplete
                    options={Object.values(employees)}
                    getOptionLabel={(option) => (option?.name ? option.name : '')}
                    value={(reporter_info) || null}
                    onChange={(e, selectedOption) => {
                        if (selectedOption) {
                            HandleTaskChanges({
                                name: 'reporter_id',
                                value: selectedOption.id,
                            });
                        } else {
                            HandleTaskChanges({
                                name: 'reporter_id',
                                value: null,
                            });
                        }
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Creator" />}
                />

                <Autocomplete
                    options={Object.values(employees)}
                    name="Assignee"
                    value={(assignee_info) || null}
                    getOptionLabel={(option) => (option?.name ? option.name : '')}
                    onChange={(e, selectedOption) => {
                        HandleTaskChanges({
                            name: 'assignee_id',
                            value: selectedOption.id,
                        });
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} fullWidth label="Assignee" />}
                />

                <DatePicker
                    label="Start Date"
                    value={task.start_date ? dayjs(task.start_date) : null}
                    onChange={(date) =>
                        HandleTaskChanges({ name: 'start_date', value: fDate(date) })
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />

                <DatePicker
                    label="End Date"
                    value={task.end_date ? dayjs(task.end_date) : null}
                    onChange={(date) => HandleTaskChanges({ name: 'end_date', value: fDate(date) })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />

                <DatePicker
                    label="Actual Start Date"
                    value={task.actual_start_date ? dayjs(fDate(task.actual_start_date)) : null}
                    onChange={(date) =>
                        HandleTaskChanges({ name: 'actual_start_date', value: fDate(date) })
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />

                <DatePicker
                    label="Actual End Date"
                    value={task.actual_end_date ? dayjs(task.actual_end_date) : null}
                    onChange={(date) =>
                        HandleTaskChanges({ name: 'actual_end_date', value: fDate(date) })
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
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
