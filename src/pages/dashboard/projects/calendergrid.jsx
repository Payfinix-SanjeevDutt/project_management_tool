import dayjs from 'dayjs';
import React, { useState } from 'react';
import duration from 'dayjs/plugin/duration';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Grid, Card, useTheme, Typography, IconButton } from '@mui/material';

dayjs.extend(duration);

const CalendarGrid = ({ logs = [] ,employeeId}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

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
    const isWeekend = [0, 6].includes(dateObj.day());
    const isHoliday = nationalHolidays.includes(dateStr);

    let status = 'Absent';
    if (isHoliday) status = 'Holiday';
    else if (isWeekend) status = 'Weekend';
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
        return theme.palette.success.light;
      case 'Absent':
        return theme.palette.error.lighter;
      case 'Weekend':
        return theme.palette.info.lighter;
      case 'Holiday':
        return theme.palette.warning.light;
      default:
        return theme.palette.grey[100];
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const prevFill = startDay;
    const nextFill = 42 - (prevFill + daysInMonth);

    for (let i = 0; i < prevFill; i+=1) days.push(null);
    for (let i = 1; i <= daysInMonth; i+=1) days.push(i);
    for (let i = 0; i < nextFill; i+=1) days.push(null);

    return days;
  };

  return (
    <Box sx={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton onClick={() => handleMonthChange(-1)}><ArrowBack /></IconButton>
        <Typography variant="h6">{currentMonth.format('MMMM YYYY')}</Typography>
        <IconButton onClick={() => handleMonthChange(1)}><ArrowForward /></IconButton>
      </Box>

      <Grid container spacing={1} sx={{ flexGrow: 1 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography variant="subtitle2" align="center">{day}</Typography>
          </Grid>
        ))}

        {generateCalendarDays().map((day, idx) => {
          if (!day) return (
            <Grid item xs={12 / 7} key={`empty-${idx}`}>
              <Box sx={{ height: 100 }} />
            </Grid>
          );

          const { status, checkin, checkout, total } = getDayData(day);

          return (
            <Grid item xs={12 / 7} key={day}>
              <Card
                sx={{
                  bgcolor: getStatusColor(status),
                  height: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  boxShadow: 'none',
                  textAlign: 'center',
                  p: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>{day}</Typography>
                <Typography variant="caption" fontWeight="bold">{status}</Typography>
                <Typography variant="caption">In: {checkin}</Typography>
                <Typography variant="caption">Out: {checkout}</Typography>
                <Typography variant="caption">Total: {total}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarGrid;
