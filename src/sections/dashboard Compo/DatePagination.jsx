import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import isoWeek from 'dayjs/plugin/isoWeek';

import { ArrowBack, ArrowForward, CalendarToday } from '@mui/icons-material';
import {
    Box,
    Card,
    Paper,
    Tooltip,
    Typography,
    IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';


dayjs.extend(isoWeek);

export default function DatePagination() {
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

    const startOfWeek = selectedDate.startOf('isoWeek');
    const endOfWeek = selectedDate.endOf('isoWeek');

    return (
        <Box p={3} bgcolor="#f3f4f6">
            <Card sx={{ p: 3, boxShadow: 3 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="#e0e0e0"
                    pb={2}
                >
                  
                    <Paper
                        elevation={2}
                        sx={{
                            display: 'flex',
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
                   
                </Box>
            </Card>
        </Box>
    );
}
