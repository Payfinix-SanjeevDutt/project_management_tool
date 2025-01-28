import { Tab, Tabs } from '@mui/material';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';

const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
];

export default function TaskTabs({ handleFilterStatus, filters }) {
    
    return (
        <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
                px: 2.5,
                boxShadow: (theme) =>
                    `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
        >
            {STATUS_OPTIONS.map((tab) => (
                <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    // label={tab.label}
                    icon={
                        <Label
                            variant="soft"
                            color={
                                tab.value === 'DONE'
                                    ? 'success'
                                    : tab.value === 'IN_PROGRESS'
                                      ? 'info'
                                      : tab.value === 'TODO'
                                        ? 'error'
                                        : undefined
                            }
                            sx={
                                tab.value !== 'DONE' &&
                                tab.value !== 'IN_PROGRESS' &&
                                tab.value !== 'TODO'
                                    ? { color: 'black' }
                                    : {}
                            }
                        >
                            {['all', 'DONE', 'IN_PROGRESS', 'TODO'].includes(tab.value) && tab.label}
                        </Label>
                    }
                />
            ))}
        </Tabs>
    );
}
