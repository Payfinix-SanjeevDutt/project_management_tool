import { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme, Typography } from '@mui/material';

import TasksIcon from 'src/assets/data/tasks.svg'
import StageIcon from 'src/assets/data/stages.svg'
import SprintIcon from 'src/assets/data/sprints.svg'
import { DashboardContent } from 'src/layouts/dashboard';

import { svgColorClasses } from 'src/components/svg-color';

import { AppWidget } from '../app-widget';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import EmployeeOverview from '../employee-overview';
import { CourseContinue } from '../course-continue';
import { BookingAvailable } from '../booking-available';
import { CourseWidgetSummary } from '../course-widget-summary';
import { BankingBalanceStatistics } from '../banking-balance-statistics';
import { BankingRecentTransitions } from '../banking-recent-transitions';

// ----------------------------------------------------------------------

export function ProjectManagementDashboardView() {
    const theme = useTheme();
    const [dashboardcounts, setDashboardCounts] = useState([]);
    const [emp1, setEmp1] = useState({ enterprise_id: '', name: '' });
    const [emp2, setEmp2] = useState({ project_id: '', name: '' });
    const [progress, setProgress] = useState({
        value: 30,
        status: 'Pending for Approval',
    });

    const activateUpdate = [
      {
        id: 1,
        employeeName: 'John Doe',
        text: 'Changes in',
        timestamp: '2024-12-04T10:15:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        text: 'Updated in',
        timestamp: '2024-12-04T12:45:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
      {
        id: 3,
        employeeName: 'Alex Johnson',
        text: 'Updated in ',
        timestamp: '2024-12-04T14:20:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
      {
        id: 4,
        employeeName: 'Maria Lee',
        text: 'Updated in',
        timestamp: '2024-12-04T16:00:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
      {
        id: 5,
        employeeName: 'Chris Brown',
        text: 'Changed in',
        timestamp: '2024-12-04T17:30:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
      {
        id: 6,
        employeeName: 'Prince Brown',
        text: 'Changed in',
        timestamp: '2024-12-04T17:30:00',
        avatarUrl: '/path/to/bob.jpg',
        updated: 'SCRUM 11 XYZ'
      },
    ];

    const transformedList = activateUpdate.map((item) => ({
      id: item.id,
      name: item.employeeName,
      avatarUrl: item.avatarUrl,
      updated: item.updated, 
      timestamp: item.timestamp,
      updatedText: item.text,
    }));
    

    const employeeData = [
        { name: 'John Doe', id: 'EMP001', image: '/path/to/john.jpg' },
        { name: 'Jane Smith', id: 'EMP002', image: '/path/to/jane.jpg' },
        { name: 'Alice Johnson', id: 'EMP003', image: '/path/to/alice.jpg' },
        { name: 'Bob Brown', id: 'EMP004', image: '/path/to/bob.jpg' },
        { name: 'Bob Brown', id: 'EMP004', image: '/path/to/bob.jpg' },
        { name: 'Bob Brown', id: 'EMP004', image: '/path/to/bob.jpg' },
    ];

    const topEmployee = [
        { name: 'John Doe', id: 'EMP001', image: '/path/to/john.jpg', totalTask: '230' },
        { name: 'Jane Smith', id: 'EMP002', image: '/path/to/jane.jpg', totalTask: '220' },
        { name: 'Alice Johnson', id: 'EMP003', image: '/path/to/alice.jpg', totalTask: '220' },
    ];

    const tableData = [
        {
            id: 1,
            name: 'John Doe',
            date: '2024-12-10',
            status: 'Pending',
            category: 'stage',
            avatarUrl: '/path/to/bob.jpg',
        },
        {
            id: 2,
            name: 'Jane Smith',
            date: '2024-12-08',
            status: 'Pending',
            category: 'stage',
            avatarUrl: '/path/to/bob.jpg',
        },
        {
            id: 3,
            name: 'Mike Johnson',
            date: '2024-12-12',
            status: 'Pending',
            category: 'sprint',
            avatarUrl: '/path/to/bob.jpg',
        },
        {
            id: 4,
            name: 'Emily Davis',
            date: '2024-12-15',
            status: 'Pending',
            category: 'stage',
            avatarUrl: '/path/to/bob.jpg',
        },
        {
            id: 5,
            name: 'Sam Davis',
            date: '2024-12-15',
            status: 'Pending',
            category: 'stage',
            avatarUrl: '/path/to/bob.jpg',
        },
    ];

    const _employeeContinue = employeeData.map((employee, index) => ({
        id: employee.id,
        name: employee.name,
        // title: _mock.courseNames(index),
        coverUrl: employee.image, // Using employee-specific images
        totalTask: 12,
        currentTask: index + 7,
    }));

    const handleProgressUpdate = () => {
        setProgress((prev) => ({
            value: prev.value + 10, // Increment progress
            status: prev.value >= 90 ? 'Success' : prev.status, // Change status on completion
        }));
    };
    return (
        <DashboardContent maxWidth="xl">
            <Grid container spacing={3} disableEqualOverflow>
                <Grid xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                            Hi, Frankie 👋
                        </Typography>
                        <Typography
                            sx={{ color: 'text.secondary' }}
                        >{`Let's learn something new today!`}</Typography>
                    </Box>
                </Grid>
                {/* <Grid container spacing={2} columns={12}> */}
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
                        title="Total Sprints"
                        total={3}
                        color="success"
                        icon={
                          <img
                              src={SprintIcon}
                              alt="Office Icon"
                              style={{ width: '100%', height: '100%' }}
                          />
                      }
                    />
                </Grid>

                <Grid item xs={11} md={3}>
                    <CourseWidgetSummary
                        title="Total Tasks"
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
                {/* </Grid> */}
                <Grid container xs={12}>
                    <Grid xs={12} md={7} lg={8}>
                        <BankingBalanceStatistics
                            title="Task Workflow"
                            subheader="Statistics on balance over time"
                            chart={{
                                series: [
                                    {
                                        name: 'Weekly',
                                        categories: [
                                            'Week 1',
                                            'Week 2',
                                            'Week 3',
                                            'Week 4',
                                            'Week 5',
                                        ],
                                        data: [
                                            { name: 'Completed', data: [24, 41, 35, 151, 49] },
                                            { name: 'In Progress', data: [24, 56, 77, 88, 99] },
                                            { name: 'Not Started', data: [40, 34, 77, 88, 99] },
                                        ],
                                    },
                                    {
                                        name: 'Monthly',
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
                                        data: [
                                            {
                                                name: 'Completed',
                                                data: [83, 112, 119, 88, 103, 112, 114, 108, 93],
                                            },
                                            {
                                                name: 'In Progress',
                                                data: [46, 46, 43, 58, 40, 59, 54, 42, 51],
                                            },
                                            {
                                                name: 'Not Started',
                                                data: [25, 40, 38, 35, 20, 32, 27, 40, 21],
                                            },
                                        ],
                                    },
                                    {
                                        name: 'Yearly',
                                        categories: [
                                            '2018',
                                            '2019',
                                            '2020',
                                            '2021',
                                            '2022',
                                            '2023',
                                        ],
                                        data: [
                                            { name: 'Completed', data: [76, 42, 29, 41, 27, 96] },
                                            { name: 'In Progress', data: [46, 44, 24, 43, 44, 43] },
                                            { name: 'Not Started', data: [23, 22, 37, 38, 32, 25] },
                                        ],
                                    },
                                ],
                            }}
                        />
                    </Grid>
                    <Grid xs={12} md={5} lg={4}>
                        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
                            <BookingAvailable
                                title="Project Timeline"
                                chart={{
                                    series: [
                                        { label: 'Completed Days', value: 120 },
                                        { label: 'Available Days', value: 66 },
                                    ],
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Grid xs={12} md={7} lg={8}>
                    <BankingRecentTransitions
                        title="Task Deadline Tracker"
                        tableData={tableData}
                        headLabel={[
                            { id: 'name', label: 'Employee Name' },
                            { id: 'date', label: 'Deadline Date' },
                            // { id: 'amount', label: 'Amount' },
                            { id: 'status', label: 'Status' },
                            { id: '' },
                        ]}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <AppTopRelated title="Activate Streaming" list={transformedList} />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
                        <AppWidget
                            title="Stage Task"
                            total={1128}
                            icon="solar:user-rounded-bold"
                            chart={{ series: 48 }}
                        />

                        <AppWidget
                            title="Sprint Task"
                            total={1220}
                            icon="fluent:mail-24-filled"
                            chart={{
                                series: 75,
                                colors: [
                                    theme.vars.palette.info.light,
                                    theme.vars.palette.info.main,
                                ],
                            }}
                            sx={{
                                bgcolor: 'info.dark',
                                [`& .${svgColorClasses.root}`]: { color: 'info.light' },
                            }}
                        />
                    </Box>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AppTopAuthors title="Top Employee" list={topEmployee} />
                </Grid>

                <Grid xs={12} md={5} lg={4} mb={5} sx={{ mt: -11 }}>
                    <Box
                        sx={{
                            gap: 3,
                            display: 'flex',
                            flexDirection: 'column',
                           
                        }}
                    >
                        <CourseContinue title="Employee Task Progress" list={_employeeContinue} />
                    </Box>
                </Grid>

                {/*  <Grid xs={12}>
          <BookingNewest
            title="Newest booking"
            subheader={`${_bookingNew.length} bookings`}
            list={_bookingNew}
          />
        </Grid> */}

                {/* <Grid xs={12}>
          <BookingDetails
            title="Booking details"
            tableData={_bookings}
            headLabel={[
              { id: 'destination', label: 'Destination' },
              { id: 'customer', label: 'Customer' },
              { id: 'checkIn', label: 'Check in' },
              { id: 'checkOut', label: 'Check out' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}
            </Grid>
        </DashboardContent>
    );
}
