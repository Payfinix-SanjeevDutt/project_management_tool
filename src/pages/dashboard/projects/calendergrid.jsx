import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useState, useEffect } from 'react';

import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Grid, Card, Typography, IconButton } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

dayjs.extend(duration);

const CalendarGrid = ({ logs = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const today = dayjs();
    const [nationalHolidays, setNationalHolidays] = useState([]);
    const startOfMonth = currentMonth.startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await axiosInstance.get(endpoints.holiday.list);
                console.log(response.data);

                if (response.data.status) {
                    const holidays = [];

                    response.data.data.forEach((h) => {
                        const start = dayjs(h.start_date);
                        const end = dayjs(h.end_date || h.start_date); 
                        const diff = end.diff(start, 'day');

                        for (let i = 0; i <= diff; i += 1) {
                            holidays.push({
                                date: start.add(i, 'day').format('YYYY-MM-DD'),
                                name: h.holiday_name,
                            });
                        }
                    });

                    setNationalHolidays(holidays);
                }
            } catch (error) {
                console.error('Failed to fetch holidays:', error);
            }
        };

        fetchHolidays();
    }, []);

    console.log(nationalHolidays);
    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) => prev.add(direction, 'month'));
    };

    const getDayData = (day) => {
        const dateObj = currentMonth.date(day);
        const dateStr = dateObj.format('YYYY-MM-DD');
        const log = logs.find((entry) => entry.date === dateStr);
        const isFuture = dateObj.isAfter(today, 'day');

        const isWeekend = [0, 6].includes(dateObj.day());
        const holiday = nationalHolidays.find((h) => h.date === dateStr);
        const isHoliday = Boolean(holiday);
        let status = 'Absent';

        if (isWeekend) {
            status = 'Weekend'; 
        } else if (isHoliday) {
            status = 'Holiday';
        } else if (log?.checkin && dateObj.isSame(today, 'day')) {
            status = 'Present';
        } else if (log?.status === 'Present') {
            status = 'Present';
        } else if (isFuture) {
            status = '';
        }

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
            holidayName: status === 'Holiday' ? holiday?.name : '', 
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return '#F1FFF0';
            case 'Absent':
                return '#FFEEEE';
            case 'Weekend':
                return '#B3F6F6'; 
            case 'Holiday':
                return '#FFEB99';
            default:
                return '#white'; 
        }
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
    const isLessThan8Hours = (totalStr) => {
        if (!totalStr || totalStr === '--') return false;
        const [hStr, mStr] = totalStr.split(' ');
        const hours = parseInt(hStr?.replace('h', ''), 10) || 0;
        const minutes = parseInt(mStr?.replace('m', ''), 10) || 0;
        return hours < 8;
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

                    const { status, checkin, checkout, total, holidayName } = getDayData(day);
                    const showDetails = status && status !== '';

                    return (
                        <Grid item xs={12 / 7} key={day}>
                            <Card
                                sx={{
                                    bgcolor: getStatusColor(status),
                                    height: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    borderRadius: 2,
                                    p: 1,
                                    color: getTextColor(),
                                    border: `1px solid ${getBorderColor()}`,
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                    transition: 'all 0.3s ease-in-out',
                                    textAlign: 'center',
                                    '@keyframes blinker': {
                                        '50%': { opacity: 0 },
                                    },
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
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            sx={{
                                                color:
                                                    status === 'Present'
                                                        ? 'green'
                                                        : status === 'Absent'
                                                          ? 'red'
                                                          : 'inherit',
                                            }}
                                        >
                                            {status}
                                        </Typography>

                                        {status === 'Holiday' && holidayName && (
                                            <Typography variant="caption" fontSize={12}>
                                                {holidayName}
                                            </Typography>
                                        )}

                                        {status === 'Present' && (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                            >
                                                <Typography variant="caption" fontSize={12}>
                                                    In: {checkin}
                                                </Typography>
                                                <Typography variant="caption" fontSize={12}>
                                                    Out: {checkout}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    fontSize={12}
                                                    sx={{
                                                        color:
                                                            total && isLessThan8Hours(total)
                                                                ? 'red'
                                                                : 'green',
                                                        animation:
                                                            total && isLessThan8Hours(total)
                                                                ? 'blinker 1s linear infinite'
                                                                : 'none',
                                                    }}
                                                >
                                                    Total: {total}
                                                </Typography>
                                            </Box>
                                        )}
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
