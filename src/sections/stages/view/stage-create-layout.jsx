import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StageCreateForm from '../stage-create-form';

export function NewStageLayout() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Create a new Stage"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Stages', href: paths.dashboard.stages.create },
                    { name: 'New Stage' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <StageCreateForm />
        </DashboardContent>
    );
}
