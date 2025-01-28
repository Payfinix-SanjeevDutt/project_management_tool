import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/account/view';

const metadata = { title: `Account settings | Dashboard - ${CONFIG.site.name}` };

export default function EmployeeAccount() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <AccountView />
        </>
    );
}
