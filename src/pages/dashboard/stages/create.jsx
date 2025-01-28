import { Helmet } from 'react-helmet-async';

import { NewStageLayout } from 'src/sections/stages/view';

const metadata = {
    title: 'PMS-Create Stage',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function StageCreate() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <NewStageLayout />
        </>
    );
}
