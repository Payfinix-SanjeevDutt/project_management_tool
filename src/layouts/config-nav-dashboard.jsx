import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';
import { fetchStages } from 'src/redux/slices/stages';
import { fetchEmployees } from 'src/redux/slices/project_assignee';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
    user: icon('ic-user-group'),
    reports: icon('ic-reports'),
    sprints: icon('ic-sprints'),
    branch: icon('ic-branch'),
    flow: icon('ic-flow'),
    file: icon('ic-file'),
    lock: icon('ic-lock'),
    label: icon('ic-label'),
    blank: icon('ic-blank'),
    folder: icon('ic-folder'),
    library: icon('ic-library'),
    disabled: icon('ic-disabled'),
    external: icon('ic-external'),
    menuItem: icon('ic-menu-item'),
    dashboard: icon('ic-dashboard'),
    parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export function useNavConfig() {
    const { stages } = useSelector((state) => state.stages);
    const { currentProjectId } = useSelector((state) => state.projects);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentProjectId) {
            dispatch(fetchStages(currentProjectId));
            dispatch(fetchEmployees(currentProjectId));
        }
        // eslint-disable-next-line
    }, [currentProjectId]);

    const navConfig = [
        {
            items: [
                {
                    title: 'Dashboard',
                    path: paths.dashboard.projectdashboard.root(currentProjectId),
                    icon: ICONS.dashboard,
                    children: [
                        {
                            title: 'Stages Dashboard',
                            path: paths.dashboard.projectdashboard.homestages(currentProjectId),
                        },
                        {
                            title: 'Sprints Dashboard',
                            path: paths.dashboard.projectdashboard.homesprints(currentProjectId),
                        },
                        {
                            title: 'Users Dashboard',
                            path: paths.dashboard.projectdashboard.homeusers(currentProjectId),
                        },
                    ],
                },

                {
                    title: 'Stages',
                    path: paths.dashboard.stages.root,
                    icon: ICONS.flow,
                    children: [
                        ...stages.map((stage) => ({
                            title: stage.stage_name,
                            path: paths.dashboard.stages.task(stage.id),
                        })),
                        {
                            title: 'Create Stage',
                            path: paths.dashboard.stages.create,
                            info: <Label color="info">NEW</Label>,
                        },
                    ],
                },
                {
                    title: 'Sprints',
                    path: paths.dashboard.sprints.root,
                    icon: ICONS.sprints,
                    children: [
                        { title: 'Backlog', path: paths.dashboard.sprints.backlog },
                        { title: 'Timeline', path: paths.dashboard.sprints.timeline },
                    ],
                },

                { title: 'File Manager', path: paths.dashboard.fileManager, icon: ICONS.library },
                {
                    title: 'Reports',
                    path: paths.dashboard.reports.root,
                    icon: ICONS.reports,
                    children: [
                        {
                            title: 'Employee Reports',
                            path: paths.dashboard.reports.employeeReports,
                            children: [
                                {
                                    title: 'Performance by Employee',
                                    path: paths.dashboard.reports.employeeReports,
                                },
                                {
                                    title: 'Monthly Performance Overview',
                                    path: paths.dashboard.reports.employeeReports,
                                },
                            ],
                        },
                        {
                            title: 'Task Progress Reports',
                            path: paths.dashboard.reports.taskProgress,
                            children: [
                                {
                                    title: 'Task Status Overview',
                                    path: paths.dashboard.reports.taskProgress,
                                },
                                {
                                    title: 'Subtask Status Overview',
                                    path: paths.dashboard.reports.taskProgress,
                                },
                                {
                                    title: 'Tasks by Employee',
                                    path: paths.dashboard.reports.taskProgress,
                                },
                                {
                                    title: 'Subtasks by Employee',
                                    path: paths.dashboard.reports.taskProgress,
                                },
                            ],
                        },
                        {
                            title: 'Sprint Reports',
                            path: paths.dashboard.reports.sprintProgress,
                            children: [
                                {
                                    title: 'Sprint Goals and Objectives',
                                    path: paths.dashboard.reports.sprintProgress,
                                },
                                {
                                    title: 'Completed vs Remaining Tasks',
                                    path: paths.dashboard.reports.sprintProgress,
                                },
                                {
                                    title: 'Team Velocity and Performance',
                                    path: paths.dashboard.reports.sprintProgress,
                                },
                            ],
                        },
                    ],
                },
                {
                    title: 'Settings',
                    path: paths.dashboard.settings.root,
                    icon: <Iconify icon="iconamoon:settings-fill" />,
                    children: [
                        { title: 'Details', path: paths.dashboard.settings.details },
                        { title: 'Access', path: paths.dashboard.employees.list },
                        { title: 'Notifications', path: '#' },
                    ],
                },
            ],
        },
    ];

    return navConfig;
}
