import { Helmet } from 'react-helmet-async';

import CreateProject from 'src/sections/project/project-new-create';

const metadata = {
    title: 'Minimals UI: The starting point for your next project',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function ProjectList() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <CreateProject />
        </>
    );
}

// export default function SettingsDetailsPage() {
//     return <>Seetings</>;
// }
