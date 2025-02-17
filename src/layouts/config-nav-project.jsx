import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

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

export const navData = [
    {
        subheader: 'Overview',
        items: [
            {
                title: 'Dashboard',
                path: paths.main.dashboard.root,
                icon: ICONS.dashboard,
                children: [
                    { title: 'Employee dashboard', path: paths.main.dashboard.user },
                    { title: 'Project dashboard', path: paths.main.dashboard.project },
                    { title: 'List Project dashboard', path: paths.main.dashboard.listProject}
                ],
            },
            {
                title: 'Projects',
                path: paths.main.project.root,
                icon: ICONS.menuItem,
                children: [
                    { title: 'list', path: paths.main.project.root },
                    { title: 'create', path: paths.main.project.create },
                ],
            },
            {
                title: 'User',
                path: paths.main.user.root,
                icon: ICONS.user,
                children: [
                    { title: 'Account', path: paths.main.user.account },
                    { title: 'Profile', path: '/' },
                ],
            },
        ],
    },
];
