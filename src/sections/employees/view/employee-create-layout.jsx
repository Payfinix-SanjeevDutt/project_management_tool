import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


export function EmployeeCreateLayout() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new user"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'User', href: paths.dashboard.employees.create },
                    { name: 'New user' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            {/* <EmployeeEditForm /> */}
        </DashboardContent>
    );
}
