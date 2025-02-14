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
            project: `${ROOTS.MAIN_PAGE}/dashboard/user-dashboard`,
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
            root: (projectId) =>  `${ROOTS.DASHBOARD}/${projectId}/stages`,
            create:(projectId) => `${ROOTS.DASHBOARD}/stages/${projectId}/new`,
            task: (projectId,id) => `${ROOTS.DASHBOARD}/stages/${projectId}/${id}/view`,
            edit: (projectId,id) => `${ROOTS.DASHBOARD}/stages/${projectId}/${id}/edit`,
        },
        sprints: {
            root: (projectId) => `${ROOTS.DASHBOARD}/${projectId}/sprints/`,
            backlog: (projectId) => `${ROOTS.DASHBOARD}/sprints/${projectId}/backlog`,
            timeline: (projectId) => `${ROOTS.DASHBOARD}/sprints/${projectId}/timeline`,
        },
        employees: {
            list: (projectId) =>  `${ROOTS.DASHBOARD}/employee/${projectId}/list`,
        },
        settings: {
            root: (projectId) => `${ROOTS.DASHBOARD}/${projectId}/settings/`,
            details:(projectId) => `${ROOTS.DASHBOARD}/settings/${projectId}/details`,
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
