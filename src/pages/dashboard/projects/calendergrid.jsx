import dayjs from 'dayjs';
import React, { useState } from 'react';
import duration from 'dayjs/plugin/duration';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Grid, Card, useTheme, Typography, IconButton } from '@mui/material';

dayjs.extend(duration);

const CalendarGrid = ({ logs = [], employeeId }) => {
    const theme = useTheme();
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const today = dayjs();

    const nationalHolidays = ['2025-01-26', '2025-04-14', '2025-08-15', '2025-10-02'];

    const startOfMonth = currentMonth.startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) => prev.add(direction, 'month'));
    };

    const getDayData = (day) => {
        const dateObj = currentMonth.date(day);
        const dateStr = dateObj.format('YYYY-MM-DD');
        const log = logs.find((entry) => entry.date === dateStr);
        const isFuture = dateObj.isAfter(today, 'day');

        if (isFuture) {
            return {
                status: '',
                checkin: '',
                checkout: '',
                total: '',
            };
        }

        const isWeekend = [0, 6].includes(dateObj.day());
        const isHoliday = nationalHolidays.includes(dateStr);
        let status = 'Absent';

        if (isHoliday) status = 'Holiday';
        else if (isWeekend) status = 'Weekend';
        else if (log?.checkin && dateObj.isSame(today, 'day')) status = 'Present';
        else if (log?.status === 'Present') status = 'Present';

        const totalTime =
            log?.checkin && log?.checkout
                ? dayjs
                      .duration(dayjs(log.checkout, 'HH:mm').diff(dayjs(log.checkin, 'HH:mm')))
                      .format('H[h] mm[m]')
                : '--';

        return {
            status,
            checkin: log?.checkin || '--',
            checkout: log?.checkout || '--',
            total: totalTime,
        };
    };

  const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return '#77ED8B'; // Success Light
    case 'Absent':
      return '#FFA48D'; // Error Light
    case 'Weekend':
      return '#61F3F3'; // Info Light
    case 'Holiday':
      return '#FFD666'; // Warning Light
    default:
      return '#F4F6F8'; // Neutral Light
  }
};



    const getBorderColor = () => '#E5E8EB'; // Light gray (matches Minimals borders)

    const getTextColor = () => '#212B36'; // Primary text gray

    const generateCalendarDays = () => {
        const days = [];
        const prevFill = startDay;
        const nextFill = 42 - (prevFill + daysInMonth);

        for (let i = 0; i < prevFill; i += 1) days.push(null);
        for (let i = 1; i <= daysInMonth; i += 1) days.push(i);
        for (let i = 0; i < nextFill; i += 1) days.push(null);

        return days;
    };

    return (
        <Box sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <IconButton onClick={() => handleMonthChange(-1)}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6">{currentMonth.format('MMMM YYYY')}</Typography>
                <IconButton onClick={() => handleMonthChange(1)}>
                    <ArrowForward />
                </IconButton>
            </Box>

            <Grid container spacing={1} sx={{ flexGrow: 1 }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Grid item xs={12 / 7} key={day}>
                        <Typography variant="subtitle2" align="center" fontWeight="bold">
                            {day}
                        </Typography>
                    </Grid>
                ))}

                {generateCalendarDays().map((day, idx) => {
                    if (!day) {
                        return (
                            <Grid item xs={12 / 7} key={`empty-${idx}`}>
                                <Box sx={{ height: 100 }} />
                            </Grid>
                        );
                    }

                    const { status, checkin, checkout, total } = getDayData(day);
                    const showDetails = status && status !== '';

                    return (
                        <Grid item xs={12 / 7} key={day}>
                            <Card
                                sx={{
                                    bgcolor: getStatusColor(status),
                                    height: 110,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    p: 1.5,
                                    color: getTextColor(),
                                    border: `1px solid ${getBorderColor()}`,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                                    },
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                                    {day}
                                </Typography>
                                {showDetails && (
                                    <>
                                        <Typography variant="body2" fontWeight="600">
                                            {status}
                                        </Typography>
                                        <Typography variant="caption" fontSize={12}>
                                            In: {checkin}
                                        </Typography>
                                        <Typography variant="caption" fontSize={12}>
                                            Out: {checkout}
                                        </Typography>
                                        <Typography variant="caption" fontSize={12}>
                                            Total: {total}
                                        </Typography>
                                    </>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default CalendarGrid;
