

import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from 'src/components/settings';

import SprintForm from 'src/sections/new-sprint/view/sprint-form';

// ----------------------------------------------------------------------

const metadata = {
    title: 'Minimals UI: The starting point for your next project',
    description:
        'The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style',
};

export default function SprintBacklog() {
    const settings = useSettingsContext();
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </Helmet>
            <SprintForm />
        </>
    );
}
