import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import isoWeek from 'dayjs/plugin/isoWeek';

// import TimerIcon from '@mui/icons-material/Timer';
import { ArrowBack, ArrowForward, CalendarToday } from '@mui/icons-material';
import {
    Box,
    Card,
    Menu,
    Paper,
    Button,
    Tooltip,
    MenuItem,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';

// import { Iconify } from 'src/components/iconify';

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
    const [loading, setLoading] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const handleDayCreate = () => navigate(paths.main.timesheet.daily);
    const handleWeekCreate = () => navigate(paths.main.timesheet.weekly);

    const changeWeek = (offset) => {
        setLoading(true);
        setSelectedDate((prevDate) => prevDate.add(offset, 'week'));
        setTimeout(() => setLoading(false), 1000);
    };

    const startOfWeek = useMemo(() => selectedDate.startOf('week').subtract(0, 'day'), [selectedDate]);
    const endOfWeek = useMemo(() => startOfWeek.add(6, 'day'), [startOfWeek]);


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
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            transition: 'all 0.3s',
                            '&:hover': { boxShadow: 4 },
                            position: 'relative',
                            cursor: 'pointer',
                            maxWidth: 450,
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
                    <Button variant="contained" onClick={handleClick}>
                        Log Time
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <MenuItem onClick={handleDayCreate}>Log Daily</MenuItem>
                        <MenuItem onClick={handleWeekCreate}>Log Weekly</MenuItem>
                    </Menu>
                </Box>

                <Box display="flex" alignItems="center" gap={2} py={2}>
                   

                    <Box display="flex" alignItems="center" gap={2} width="50%">
                        

                        {/* <FormControl sx={{ width: 'auto' }} error={!!errors.description}>
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
                        </FormControl> */}
                    </Box>

                    
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={3}>
                        <CircularProgress value={2} />
                    </Box>
                ) : (
                    <TimesheetTable startOfWeek={startOfWeek} endOfWeek={endOfWeek} />
                )}
            </Card>
        </Box>
    );
}
