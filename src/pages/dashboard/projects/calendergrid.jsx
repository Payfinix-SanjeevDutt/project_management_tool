import dayjs from 'dayjs';
import React, { useState } from 'react';
import { keyframes } from '@emotion/react';
import duration from 'dayjs/plugin/duration';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Grid, Card, useTheme, Typography, IconButton } from '@mui/material';

dayjs.extend(duration);

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

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

  const formatTimeTo12Hour = (time) => {
    if (time === '--') return time;
    return dayjs(time, 'HH:mm').format('h:mm A');
  };

  const getDayData = (day) => {
    const dateObj = currentMonth.date(day);
    const dateStr = dateObj.format('YYYY-MM-DD');
    const log = logs.find((entry) => entry.date === dateStr);
    const isFuture = dateObj.isAfter(today, 'day');
    const isWeekend = [0, 6].includes(dateObj.day());
    const isHoliday = nationalHolidays.includes(dateStr);

    if (isFuture) {
      return {
        status: '',
        checkin: '',
        checkout: '',
        total: '',
        isWeekend,
      };
    }

    let status = 'Absent';

    if (isHoliday) status = 'Holiday';
    else if (isWeekend) status = 'Weekend';
    else if (log?.checkin && dateObj.isSame(today, 'day')) status = 'Present';
    else if (log?.status === 'Present') status = 'Present';

    let totalTime = '--';
    let totalHours = 0;

    if (log?.checkin && log?.checkout) {
      totalHours = dayjs(log.checkout, 'HH:mm').diff(dayjs(log.checkin, 'HH:mm'), 'hour', true);
      totalTime = dayjs
        .duration(dayjs(log.checkout, 'HH:mm').diff(dayjs(log.checkin, 'HH:mm')))
        .format('H[h] mm[m]');
    }

    return {
      status,
      checkin: log?.checkin ? formatTimeTo12Hour(log.checkin) : '--',
      checkout: log?.checkout ? formatTimeTo12Hour(log.checkout) : '--',
      total: totalTime,
      isWeekend,
      isLessThan8Hours: totalHours < 8 && totalHours > 0,
    };
  };

  const getStatusColor = (status, isWeekend) => {
    if (status === 'Absent') {
      return '#FFA48D';
    }
    if (status === 'Weekend') {
      return '#E0E0E0'; // Light gray for weekends
    }
    return '#F4F6F8'; // Default light background
  };

  const getBorderColor = () => '#E5E8EB';
  const getTextColor = () => '#212B36';

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

          const { status, checkin, checkout, total, isWeekend, isLessThan8Hours } = getDayData(day);

          return (
            <Grid item xs={12 / 7} key={day}>
              <Card
                sx={{
                  bgcolor: getStatusColor(status, isWeekend),
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
                <Typography variant="subtitle1" fontWeight={isWeekend ? 'bold' : 800} mb={0.5}>
                  {day}
                </Typography>

                {status === 'Present' ? (
                  <>
                    <Typography variant="body2" fontWeight="bold" color={theme.palette.primary.main}>
                      Present
                    </Typography>
                    {!isWeekend && (
                      <>
                        <Box display="flex" gap={0.5}>
                          <Typography variant="caption" fontSize={12} fontWeight="bold">In:</Typography>
                          <Typography variant="caption" fontSize={12}>{checkin}</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <Typography variant="caption" fontSize={12} fontWeight="bold">Out:</Typography>
                          <Typography variant="caption" fontSize={12}>{checkout}</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <Typography
                            variant="caption"
                            fontSize={12}
                            fontWeight="bold"
                            sx={{
                              color: isLessThan8Hours ? '#FF4842' : 'inherit',
                              animation: isLessThan8Hours ? `${blink} 1s infinite` : 'none',
                            }}
                          >
                            Total:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize={12}
                            sx={{
                              color: isLessThan8Hours ? '#FF4842' : 'inherit',
                              animation: isLessThan8Hours ? `${blink} 1s infinite` : 'none',
                              fontWeight: isLessThan8Hours ? 'bold' : 'normal',
                            }}
                          >
                            {total}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                ) : status && status !== 'Absent' ? (
                  <>
                    <Typography variant="body2" fontWeight="600">
                      {status}
                    </Typography>
                    {!isWeekend && (
                      <>
                        <Box display="flex" gap={0.5}>
                          <Typography variant="caption" fontSize={12} fontWeight="bold">In:</Typography>
                          <Typography variant="caption" fontSize={12}>{checkin}</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <Typography variant="caption" fontSize={12} fontWeight="bold">Out:</Typography>
                          <Typography variant="caption" fontSize={12}>{checkout}</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <Typography
                            variant="caption"
                            fontSize={12}
                            fontWeight="bold"
                            sx={{
                              color: isLessThan8Hours ? '#FF4842' : 'inherit',
                              animation: isLessThan8Hours ? `${blink} 1s infinite` : 'none',
                            }}
                          >
                            Total:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize={12}
                            sx={{
                              color: isLessThan8Hours ? '#FF4842' : 'inherit',
                              animation: isLessThan8Hours ? `${blink} 1s infinite` : 'none',
                              fontWeight: isLessThan8Hours ? 'bold' : 'normal',
                            }}
                          >
                            {total}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                ) : status === 'Absent' ? (
                  <Typography variant="body2" fontWeight="600">
                    {status}
                  </Typography>
                ) : null}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalendarGrid;
