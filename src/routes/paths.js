const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
    MAIN_PAGE: '/main',
};

// ----------------------------------------------------------------------

export const paths = {
    auth: {
        signIn: `${ROOTS.AUTH}/sign-in`,
        verify: `${ROOTS.AUTH}/verify`,
        signUp: `${ROOTS.AUTH}/sign-up`,
        updatePassword: `${ROOTS.AUTH}/update-password`,
        resetPassword: `${ROOTS.AUTH}/reset-password`,
    },
    // DASHBOARD
    main: {
        dashboard: {
            user: `${ROOTS.MAIN_PAGE}/dashboard/user-dashboard`,
            project: `${ROOTS.MAIN_PAGE}/dashboard/project-dashboard`,
            listProject: `${ROOTS.MAIN_PAGE}/dashboard/list-project-dashboard`,
            TimeLog: `${ROOTS.MAIN_PAGE}/dashboard/time-log-dashboard`,
            Leave: `${ROOTS.MAIN_PAGE}/dashboard/leave-dashboard`,
            root: `${ROOTS.MAIN_PAGE}/dashboard`,
        },
        project: {
            root: `${ROOTS.MAIN_PAGE}/projects`,
            create: `${ROOTS.MAIN_PAGE}/projects/create`,
            access: (token) => `${ROOTS.MAIN_PAGE}/project-access/${token}`,
        },
        timesheet: {
            root: `${ROOTS.MAIN_PAGE}/timesheet`,
            create: `${ROOTS.MAIN_PAGE}/timesheet/create`,
            dashboard: `${ROOTS.MAIN_PAGE}/timesheet/DashboardView`,
            daily: `${ROOTS.MAIN_PAGE}/timesheet/create-daily`,
            weekly: `${ROOTS.MAIN_PAGE}/timesheet/create-weekly`,
            edit: (timesheetId, employeeId) =>
                `${ROOTS.MAIN_PAGE}/timesheet/edit/${timesheetId}/${employeeId}`,
        },
        user: {
            root: `${ROOTS.MAIN_PAGE}/user`,
            account: `${ROOTS.MAIN_PAGE}/user/account`,
        },
        holiday: {
            root: `${ROOTS.MAIN_PAGE}/holiday`,
            create: `${ROOTS.MAIN_PAGE}/holiday/holiday-create`,
            list: `${ROOTS.MAIN_PAGE}/holiday/holiday-list`,
            leaveCreate : `${ROOTS.MAIN_PAGE}/holiday/leave/apply-leave`,
            assignLeave : `${ROOTS.MAIN_PAGE}/holiday/leave/assign-leave`
        }

    },
    dashboard: {
        root: (projectId) => `${ROOTS.DASHBOARD}/${projectId}`,
        projectdashboard: {
            root: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}`,
            homesprints: (projectId) =>
                `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homesprints`,
            homestages: (projectId) =>
                `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homestages`,
            homeusers: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homeusers`,
        },
        stages: {
            root: (projectId) => `${ROOTS.DASHBOARD}/stages/${projectId}`,
            create: (projectId) => `${ROOTS.DASHBOARD}/stages/${projectId}/new`,
            task: (projectId, id) => `${ROOTS.DASHBOARD}/stages/${projectId}/${id}/view`,
            taskview: (projectId, id, taskid) =>
                `${ROOTS.DASHBOARD}/stages/${projectId}/${id}/${taskid}/view`,
            edit: (projectId, id) => `${ROOTS.DASHBOARD}/stages/${projectId}/${id}/edit`,
        },
        sprints: {
            root: (projectId) => `${ROOTS.DASHBOARD}/sprints/${projectId}`,
            backlog: (projectId) => `${ROOTS.DASHBOARD}/sprints/${projectId}/backlog`,
            timeline: (projectId) => `${ROOTS.DASHBOARD}/sprints/${projectId}/timeline`,
        },
        employees: {
            list: (projectId) => `${ROOTS.DASHBOARD}/employee/${projectId}/list`,
        },
        settings: {
            root: (projectId) => `${ROOTS.DASHBOARD}/settings/${projectId}`,
            details: (projectId) => `${ROOTS.DASHBOARD}/settings/${projectId}/details`,
        },
        fileManager: (projectId) => `${ROOTS.DASHBOARD}/filemanager/${projectId}`,
        reports: {
            root: `${ROOTS.DASHBOARD}/reports/`,
            employeeReports: `${ROOTS.DASHBOARD}/reports/employeeReports`,
            taskProgress: `${ROOTS.DASHBOARD}/reports/taskProgress`,
            sprintProgress: `${ROOTS.DASHBOARD}/reports/sprintProgress`,
        },
    },
};
