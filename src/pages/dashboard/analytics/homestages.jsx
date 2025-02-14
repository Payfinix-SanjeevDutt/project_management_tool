import { Helmet } from 'react-helmet-async';

import DashboardStageView  from 'src/sections/home/homestages/view/home-stage-view';

// ----------------------------------------------------------------------

const metadata = {
    title: 'Minimals UI: The starting point for your next project',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function HomeStages() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <DashboardStageView />
        </>
    );
}
