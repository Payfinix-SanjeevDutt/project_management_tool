import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EmployeeListView } from 'src/sections/employees/view';
// ----------------------------------------------------------------------

const metadata = { title: `User list | Dashboard - ${CONFIG.site.name}` };

export default function EmployeeList() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <EmployeeListView />
        </>
    );
}
