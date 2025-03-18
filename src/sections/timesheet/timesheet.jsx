import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import isoWeek from 'dayjs/plugin/isoWeek';

import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
    Box,
    Card,
    Menu,
    Button,
    Select,
    Tooltip,
    MenuItem,
    TextField,
    Typography,
    InputLabel,
    IconButton,
    FormControl,
    FormHelperText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import TimesheetTable from './list-timesheet';

dayjs.extend(isoWeek);

export default function TimeLogs() {
    const [time] = useState('00:00:00');
    const [project, setProject] = useState('');
    const [job, setJob] = useState('');
    const [description, setDescription] = useState('');
    const [workItem, setworkItem] = useState('');
    const [billable, setBillable] = useState('billable');
    const [errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showArrows, setShowArrows] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();

    const handleDayCreate = () => navigate(paths.main.timesheet.daily);
    const handleWeekCreate = () => navigate(paths.main.timesheet.weekly);

    const handleDateChange = (date) => setSelectedDate(date);

    const changeWeek = (offset) => setSelectedDate((prevDate) => prevDate.add(offset, 'week'));

    const startOfWeek = selectedDate.startOf('isoWeek');
    const endOfWeek = selectedDate.endOf('isoWeek');

    return (
        <Box p={3} bgcolor="#f3f4f6">
            <Card sx={{ p: 3, boxShadow: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="#e0e0e0"
                    pb={2}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Time Logs
                    </Typography>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        position="relative"
                        p={1}
                        border={1}
                        borderColor="#ccc"
                        borderRadius={1}
                        bgcolor="#fff"
                        onMouseEnter={() => setShowArrows(true)}
                    >
                        {showArrows && (
                            <Tooltip title="Previous">
                                <Button onClick={() => changeWeek(-1)} size="small">
                                    &#9665;
                                </Button>
                            </Tooltip>
                        )}
                        <CalendarTodayIcon />
                        {showArrows && (
                            <Tooltip title="Next">
                                <Button onClick={() => changeWeek(1)} size="small">
                                    &#9655;
                                </Button>
                            </Tooltip>
                        )}
                        <Typography>
                            {startOfWeek.format('DD-MMM-YYYY')} to {endOfWeek.format('DD-MMM-YYYY')}
                        </Typography>
                    </Box>
                    <Button variant="contained" onClick={handleClick}>
                        Log Time
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={handleDayCreate}>Log Daily</MenuItem>
                        <MenuItem onClick={handleWeekCreate}>Log Weekly</MenuItem>
                    </Menu>
                </Box>

                <Box display="flex" alignItems="center" gap={2} py={2}>
                    <FormControl sx={{ width: 240 }} error={!!errors.project}>
                        <InputLabel>Select Project</InputLabel>
                        <Select value={project} onChange={(e) => setProject(e.target.value)}>
                            <MenuItem value="">Select Project</MenuItem>
                            <MenuItem value="Project A">Project A</MenuItem>
                            <MenuItem value="Project B">Project B</MenuItem>
                        </Select>
                        {errors.project && <FormHelperText>{errors.project}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ width: 240 }} error={!!errors.job}>
                        <InputLabel>Select Job</InputLabel>
                        <Select value={job} onChange={(e) => setJob(e.target.value)}>
                            <MenuItem value="">Select Job</MenuItem>
                            <MenuItem value="Job A">Job A</MenuItem>
                            <MenuItem value="Job B">Job B</MenuItem>
                        </Select>
                        {errors.job && <FormHelperText>{errors.job}</FormHelperText>}
                    </FormControl>

                    <Box display="flex" alignItems="center" gap={2} width="40%">
                        <FormControl sx={{ flexGrow: 1 }} error={!!errors.workItem}>
                            <TextField
                                label="What are you working on?"
                                variant="outlined"
                                fullWidth
                                value={workItem}
                                onChange={(e) => setworkItem(e.target.value)}
                            />
                            {errors.workItem && <FormHelperText>{errors.workItem}</FormHelperText>}
                        </FormControl>

                        <FormControl sx={{ width: 'auto' }} error={!!errors.description}>
                            {isEditing ? (
                                <TextField
                                    label="Enter description"
                                    variant="outlined"
                                    autoFocus
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={() => setIsEditing(false)}
                                    sx={{ width: 200 }}
                                />
                            ) : (
                                <Tooltip title="Click to edit description">
                                    <IconButton onClick={() => setIsEditing(true)}>
                                        <Iconify
                                            icon="tabler:file-description-filled"
                                            width={25}
                                            height={25}
                                        />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {errors.description && (
                                <FormHelperText>{errors.description}</FormHelperText>
                            )}
                        </FormControl>
                    </Box>

                    <FormControl sx={{ width: 240 }} error={!!errors.billable}>
                        <InputLabel>Billable</InputLabel>
                        <Select value={billable} onChange={(e) => setBillable(e.target.value)}>
                            <MenuItem value="billable">Billable</MenuItem>
                            <MenuItem value="non-billable">Non-Billable</MenuItem>
                        </Select>
                        {errors.billable && <FormHelperText>{errors.billable}</FormHelperText>}
                    </FormControl>

                    <Box
                        bgcolor="black"
                        color="white"
                        p={1}
                        borderRadius={1}
                        display="flex"
                        alignItems="center"
                    >
                        <TimerIcon sx={{ mr: 1 }} /> {time}
                    </Box>
                </Box>

                <Card sx={{ mt: 2, textAlign: 'center', p: 25 }}>
                    <TimesheetTable/>
                </Card>
            </Card>
        </Box>
    );
}
