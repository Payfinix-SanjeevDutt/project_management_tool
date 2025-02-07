import { useState } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import TasksIcon from 'src/assets/data/tasks.svg';
import StageIcon from 'src/assets/data/stages.svg';
import { DashboardContent } from 'src/layouts/dashboard';

import { BookingBooked } from '../booking-booked';
import EmployeeOverview from '../employee-overview';
import { CourseWidgetSummary } from '../course-widget-summary';
import { BookingTotalIncomes } from '../booking-total-incomes';
import { BookingCheckInWidgets } from '../booking-check-in-widgets';

// ----------------------------------------------------------------------

export function DashboardStageView() {
    const theme = useTheme();
    const [dashboardcounts, setDashboardCounts] = useState([]);
    const [emp1, setEmp1] = useState({ enterprise_id: '', name: '' });
    const [emp2, setEmp2] = useState({ project_id: '', name: '' });

    const taskTracker = [
        { status: 'In Progress', quantity: 9911, value: 18.5 },
        { status: 'Not started', quantity: 1947, value: 40.1 },
        { status: 'Completed', quantity: 9124, value: 94.8 },
    ];

    const deadlineData = [
        {
            id: 1,
            name: 'John Doe', // Assigned
            category: 'Design Homepage', // Task name
            country: 5, // Days left
            totalAmount: '2024-12-15', // EndDate
            rank: 'High', // Priority
        },
        {
            id: 2,
            name: 'Jane Smith',
            category: 'Develop Login Module',
            country: 10,
            totalAmount: '2024-12-20',
            rank: 'Medium',
        },
        {
            id: 3,
            name: 'Alice Brown',
            category: 'Test API Integration',
            country: 3,
            totalAmount: '2024-12-13',
            rank: 'High',
        },
        {
            id: 4,
            name: 'Michael Scott',
            category: 'Write Documentation',
            country: 7,
            totalAmount: '2024-12-17',
            rank: 'Low',
        },
        {
            id: 5,
            name: 'Emma Wilson',
            category: 'Setup CI/CD',
            country: 12,
            totalAmount: '2024-12-22',
            rank: 'Medium',
        },
    ];

    return (
        <DashboardContent maxWidth="xl">
            <Grid container spacing={3} disableEqualOverflow>
                <Grid xs={12}>
                    <Box sx={{ mb: 2 }}>
                        {/* <Typography variant="h4" sx={{ mb: 1 }}>
                            Hi, Frankie 👋
                        </Typography>
                        <Typography
                            sx={{ color: 'text.secondary' }}
                        >{`Let's learn something new today!`}</Typography> */}
                    </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                    <CourseWidgetSummary
                        title="Total Stages"
                        total={6}
                        icon={
                            <img
                                src={StageIcon}
                                alt="Office Icon"
                                style={{ width: '100%', height: '100%' }}
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <CourseWidgetSummary
                        title="Total Tasks"
                        total={3}
                        color="success"
                        icon={
                            <img
                                src={TasksIcon}
                                alt="Office Icon"
                                style={{ width: '100%', height: '100%' }}
                            />
                        }
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <CourseWidgetSummary
                        title="Total SubTasks"
                        total={2}
                        color="secondary"
                        icon={
                            <img
                                src={TasksIcon}
                                alt="Office Icon"
                                style={{ width: '100%', height: '100%' }}
                            />
                        }
                    />
                </Grid>

                <Grid xs={12} md={3}>
                    <EmployeeOverview
                        emp1={emp1}
                        emp2={emp2}
                        data={[
                            {
                                status: 'Employees Approved',
                                quantity: dashboardcounts?.employee_approved_percentage || 0,
                                value: dashboardcounts?.employee_approved_count || 0,
                            },
                            {
                                status: 'Pending for Approval',
                                quantity: dashboardcounts?.employee_pending_percentage || 0,
                                value: dashboardcounts?.employee_pending_count || 0,
                            },
                        ]}
                    />
                </Grid>

                <Grid container xs={12}>
                    <Grid item xs={12} md={7} lg={8}>
                        <Box
                            sx={{
                                mb: 3,
                                p: { md: 1 },
                                display: 'flex',
                                gap: { xs: 3, md: 1 },
                                borderRadius: { md: 2 },
                                flexDirection: 'column',
                                bgcolor: { md: 'background.neutral' },
                                width: '100%', // Ensures it takes full width
                            }}
                        >
                            <Box
                                sx={{
                                    p: { md: 1 },
                                    display: 'grid',
                                    gap: { xs: 3, md: 0 },
                                    borderRadius: { md: 2 },
                                    bgcolor: { md: 'background.paper' },
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        md: 'repeat(2, 1fr)',
                                    },
                                    width: '100%', // Ensures it scales properly
                                }}
                            >
                                <BookingTotalIncomes
                                    title="Total tasks"
                                    total={1765}
                                    percent={2.6}
                                    chart={{
                                        categories: [
                                            'Jan',
                                            'Feb',
                                            'Mar',
                                            'Apr',
                                            'May',
                                            'Jun',
                                            'Jul',
                                            'Aug',
                                            'Sep',
                                        ],
                                        series: [{ data: [10, 41, 80, 100, 60, 120, 69, 91, 160] }],
                                    }}
                                />

                                <BookingBooked
                                    title="Task Tracker"
                                    data={taskTracker}
                                    sx={{ boxShadow: { md: 'none' }, width: '100%' }} // Ensures it fills the parent
                                />
                            </Box>

                            <BookingCheckInWidgets
                                chart={{
                                    series: [
                                        { label: 'Top Priority Task', percent: 73.9, total: 1856 },
                                        { label: 'Low Priority Task', percent: 45.6, total: 1847 },
                                    ],
                                }}
                                sx={{ boxShadow: { md: 'none' }, width: '100%' }} // Ensures full width
                            />
                        </Box>
                    </Grid>
                    {/* <Grid xs={12} md={6} lg={4}>
                        <EcommerceSaleByGender
                            title="Subtasks Flow"
                            total={324}
                            chart={{
                                series: [
                                    { label: 'Completed', value: 25 },
                                    { label: 'In Progress', value: 50 },
                                    { label: 'Not started', value: 75 },
                                ],
                            }}
                        />
                    </Grid> */}

                    {/* <Grid xs={12} md={6} lg={8}>
                        <EcommerceBestSalesman
                            title="Tasks Deadline"
                            tableData={deadlineData}
                            headLabel={[
                                { id: 'name', label: 'Assigned' },
                                { id: 'category', label: 'Task name' },
                                { id: 'country', label: 'Days left', align: 'center' },
                                { id: 'totalAmount', label: 'EndDate', align: 'right' },
                                { id: 'rank', label: 'Priority', align: 'right' },
                            ]}
                        />
                    </Grid> */}
                </Grid>
            </Grid>
        </DashboardContent>
    );
}

// import React from 'react'

// function DashboardStageView() {
//   return (
//     <div>
//       <p>stage dashboard</p>
//     </div>
//   )
// }
// export default DashboardStageView
