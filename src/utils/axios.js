    import axios from 'axios';
 
import { CONFIG } from 'src/config-global';
 
// ----------------------------------------------------------------------
 
const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });
 
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);
 
export default axiosInstance;
 
// ----------------------------------------------------------------------
 
export const fetcher = async (args) => {
    try {
        const [url, config] = Array.isArray(args) ? args : [args];
 
        const res = await axiosInstance.get(url, { ...config });
 
        return res.data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        throw error;
    }
};
 
// ----------------------------------------------------------------------
 
export const endpoints = {
    auth: {
        me: 'auth/me',
        signIn: 'auth/sign-in',
        signUp: 'auth/sign-up',
        userVerify: 'auth/user-verify',
        resetPasword:'auth/reset-password',
        otpRequest: 'auth/otp-request',
        otpVerify:'/auth/otp-verify',
        otpResend: '/auth/otp-resend',
        calendar: '/api/calendar',
    },
    user: {
        list: '/employee/',
        account: '/employee/update',
        security: '/employee/security',
        completed_overrun: '/employee/completed-overrun',
        inprogress_overrun: 'employee/inprogress-overrun',
        todo: '/employee/todo',
    },
    project:{
        create: '/project/create-project',
        list: '/project/list-projects',
        update: '/project/update-project',
        display: '/project/display-project',
        project_users: '/project/list-project-users',
        project_users_create: '/project/create-project-users',
        send_invite:'/project/send-invite',
        delete:'/project/delete-project',
        project_employee_report: '/project/project-employee-report',
        project_user_delete: '/project/project-user-delete',
        project_stage_report: '/project/project-stages-report',
        project_completed_overrun: '/project/project-task-overdue',
        project_inprogress_overrun: '/project/project-task-inprogress',
        project_todo_overrun: 'project/project-task-todo',
    },
    tasks:{
        create:'/task/create-task',
        list: '/task/get-all-tasks',
        update: '/task/updatetask',
        delete:'/task/delete-task',
        deleteall : '/task/delete-all-task',
        actions : '/task/actions',
        taskEmployeeReport: "/task/employee-task-report",
        assignee : "/task/assignee",
        reporter : "/task/reporter",
    },
    attachments:{
        attachFile : '/attachment/upload_small_file',
        getAttachFile : '/attachment/get_attached_files',
        deleteFile : '/attachment/delete_attached_files',
        downloadFile: 'attachment/download_attached_files',
    },
    stages:{
        create:'/stage/create-stage',
        list: '/stage/get-all-stages',
        update: '/stage/update-stage',
        delete:'/stage/delete-stage',
        singlelist:'/stage/getstage',
        stageEmployeeReport : "/stage/stage-employee-report",
        stageOverdue: "/stage/stage-overdue",
        stageInprogress: "/stage/stage-inprogress",
        stageTodo:"/stage/stage-todo"
    },
    sprints:{
        create:'/sprint/createsprint',
        list:'/sprint/listsprint',
        addDate: '/sprint/updatesprintdates',
        update: '/sprint/updatesprint',
        delete:  '/sprint/deletesprint',
    },
    comments:{
        create:'/task/comments',
        list:'/task/comments',
    },
    history:{
        list:'/task/history',
    },
    timesheet:{
        create :'/timesheet/create',
        list : '/timesheet/list',
        update: '/timesheet/update',
        getsingleTimesheet : '/timesheet/get-single-timesheet',
        delete : '/timesheet/delete',
        getallList : '/timesheet/get-all-list'
    },
    timelog:{
        create : '/timelog/create',
        list : '/timelog/list',
        update : '/timelog/update',
        daily: '/timelog/getdaily'
    }

};
