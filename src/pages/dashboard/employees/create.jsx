import { Helmet } from 'react-helmet-async';

import { EmployeeCreateLayout } from 'src/sections/employees/view';

const metadata = {
    title: 'PMS-Create Employee',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function EmployeeCreate() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <EmployeeCreateLayout />
        </>
    );
}
