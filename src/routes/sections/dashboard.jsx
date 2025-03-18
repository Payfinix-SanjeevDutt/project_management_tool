import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { ProjectLayout } from 'src/layouts/projects/layout';
import Userdashboard from 'src/pages/dashboard/projects/userdashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard/analytics/home'));
const HomeStages = lazy(() => import('src/pages/dashboard/analytics/homestages'));
const HomeSprints = lazy(() => import('src/pages/dashboard/analytics/homesprints'));
const HomeUsers = lazy(() => import('src/pages/dashboard/analytics/homeusers'));
const StageCreate = lazy(() => import('src/pages/dashboard/stages/create'));
const TaskView = lazy(() => import('src/pages/dashboard/tasks/view'));
const SprintBacklog = lazy(() => import('src/pages/dashboard/sprints/backlog'));
const SprintTimeline = lazy(() => import('src/pages/dashboard/sprints/timeline'));
const EmployeeList = lazy(() => import('src/pages/dashboard/employees/list'));
const EmployeeCreate = lazy(() => import('src/pages/dashboard/employees/create'));
const EmployeeAccount = lazy(() => import('src/pages/dashboard/employees/account'));
const FileManager = lazy(() => import('src/pages/dashboard/file-manager/manager'));
const ReportsSample = lazy(() => import('src/pages/dashboard/reports/sample'));
const Timesheet = lazy(() => import('src/pages/dashboard/timesheet/view'))
const TimesheetCreateDaily = lazy(() => import('src/sections/timesheet/daily-timesheet'))
const TimesheetCreateWeekly = lazy(() => import('src/sections/timesheet/weekly-timesheet'))
const ProjectCreate = lazy(() => import('src/pages/dashboard/projects/create'));
const ProjectList = lazy(() => import('src/pages/dashboard/projects/lists'));
const ProjectDashboard = lazy(() => import('src/pages/dashboard/projects/userdashboard'));
const MainProjectDashboard = lazy(() => import('src/pages/dashboard/projects/projectdashboard'));
const ListProjectDashboard = lazy(() => import('src/pages/dashboard/projects/projestlistdashboard'));
const SettingsDetailsPage = lazy(() => import('src/pages/dashboard/settings/details'));

// ----------------------------------------------------------------------

const projectLayoutContent = (
    <ProjectLayout>
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    </ProjectLayout>
);

const dashboardLayoutContent = (
    <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
            <Outlet />
        </Suspense>
    </DashboardLayout>
);

export const dashboardRoutes = [
    {
        path: '/main',
        element: CONFIG.auth.skip ? (
            <>{projectLayoutContent}</>
        ) : (
            <AuthGuard>{projectLayoutContent}</AuthGuard>
        ),
        children: [
            {
                path: 'projects',
                children: [
                    { element: <ProjectList />, index: true },
                    { path: 'create', element: <ProjectCreate /> },
                ],
            },
            {
                path: 'user',
                children: [
                    { element: <EmployeeAccount />, index: true },
                    { path: 'new', element: <EmployeeCreate /> },
                    { path: 'account', element: <EmployeeAccount /> },
                ],
            },
            {
                path: 'dashboard',
                children: [
                    { element: <ProjectDashboard />, index: true },
                    { path: 'user-dashboard', element: <Userdashboard /> },
                    { path: 'project-dashboard', element: <MainProjectDashboard /> },
                    { path: 'list-project-dashboard', element: <ListProjectDashboard /> },
                ],
            },
            {
                path : 'timesheet',
                children: [
                    { element: <Timesheet />,index : true },
                    { path: 'timesheet' ,element: <Timesheet/>},
                    { path : 'create-daily' ,element: <TimesheetCreateDaily/>},
                    { path : 'create-weekly' , element : <TimesheetCreateWeekly/>}
                ]        
            },
        ],
    },
    {
        path: 'dashboard',
        element: CONFIG.auth.skip ? (
            <>{dashboardLayoutContent}</>
        ) : (
            <AuthGuard>{dashboardLayoutContent}</AuthGuard>
        ),
        children: [
            { element: <IndexPage />, index: true },
            {
                path: 'projectdashboard/:project_id',
                children: [
                    { element: <IndexPage />, index: true },
                    { path: 'homesprints', element: <HomeSprints /> },
                    { path: 'homestages', element: <HomeStages /> },
                    { path: 'homeusers', element: <HomeUsers /> },
                ],
            },
            {
                path: 'sprints/:project_id',
                children: [
                    { element: <SprintTimeline />, index: true },
                    { path: 'timeline', element: <SprintTimeline /> },
                    { path: 'backlog', element: <SprintBacklog /> },
                ],
            },
            {
                path: 'employee/:project_id',
                children: [{ path: 'list', element: <EmployeeList /> }],
            },
            {
                path: 'stages/:project_id',
                children: [
                    { element: <StageCreate />, index: true },
                    { path: 'new', element: <StageCreate /> },
                    { path: ':id/edit', element: <StageCreate /> },
                    { path: ':id/view', element: <TaskView /> },
                ],
            },

        {
            path: 'filemanager/:project_id',
            children: [{ element: <FileManager />, index: true }],
        },
        {
            path: 'settings/:project_id',
            children: [
                { element: <SettingsDetailsPage />, index: true },
                { path: 'details', element: <SettingsDetailsPage /> },
            ],
        },
        {
            path: 'reports',
            children: [
                { element: <ReportsSample />, index: true },
                { path: 'employeeReports', element: <ReportsSample /> },
                { path: 'taskProgress', element: <ReportsSample /> },
                { path: 'sprintProgress', element: <ReportsSample /> },
            ],
        },
        {
            path : 'project-access/:token',
        }
    ],
},
];
