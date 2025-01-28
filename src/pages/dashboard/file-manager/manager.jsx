import { Helmet } from 'react-helmet-async';

import { FileManagerView } from 'src/sections/file-manager/view';

const metadata = {
    title: 'Dashboard: File Manager',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function FileManager() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <FileManagerView />
        </>
    );
}
