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
        dashboard:{
            user: `${ROOTS.MAIN_PAGE}/dashboard/user-dashboard`,
            root: `${ROOTS.MAIN_PAGE}/dashboard`
        },
        project: {
            root: `${ROOTS.MAIN_PAGE}/projects`,
            create: `${ROOTS.MAIN_PAGE}/projects/create`,
            access: (token) => `${ROOTS.MAIN_PAGE}/project-access/${token}`,
        },
        user: {
            root: `${ROOTS.MAIN_PAGE}/user`,
            account: `${ROOTS.MAIN_PAGE}/user/account`,
        },
    },
    dashboard: {
        root: (projectId) => `${ROOTS.DASHBOARD}/${projectId}`,

        projectdashboard: {
            root: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}`,
            homesprints: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homesprints`,
            homestages: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homestages`,
            homeusers: (projectId) => `${ROOTS.DASHBOARD}/projectdashboard/${projectId}/homeusers`,
        },
        stages: {
            root: `${ROOTS.DASHBOARD}/stages/`,
            create: `${ROOTS.DASHBOARD}/stages/new`,
            task: (id) => `${ROOTS.DASHBOARD}/stages/${id}/view`,
            edit: (id) => `${ROOTS.DASHBOARD}/stages/${id}/edit`,
        },
        sprints: {
            root: `${ROOTS.DASHBOARD}/sprints/`,
            backlog: `${ROOTS.DASHBOARD}/sprints/backlog`,
            timeline: `${ROOTS.DASHBOARD}/sprints/timeline`,
        },
        employees: {
            list: `${ROOTS.DASHBOARD}/employee/list`,
        },
        settings: {
            root: `${ROOTS.DASHBOARD}/settings/`,
            details: `${ROOTS.DASHBOARD}/settings/details`,
        },
        fileManager: `${ROOTS.DASHBOARD}/filemanager/`,
        reports: {
            root: `${ROOTS.DASHBOARD}/reports/`,
            employeeReports: `${ROOTS.DASHBOARD}/reports/employeeReports`,
            taskProgress: `${ROOTS.DASHBOARD}/reports/taskProgress`,
            sprintProgress: `${ROOTS.DASHBOARD}/reports/sprintProgress`,
        },
    },
};
