import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useTabs } from 'src/hooks/use-tabs';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';

// ----------------------------------------------------------------------

const TABS = [
    { value: '7days', label: 'Recent 7 days' },
    { value: '30days', label: 'Recent 30 days' },
    { value: 'all', label: 'All times' },
];

// ----------------------------------------------------------------------

export function AppTopRelated({ title, subheader, list, ...other }) {
    console.log('list>>', list);

    const tabs = useTabs('7days');

    const renderTabs = (
        <CustomTabs
            value={tabs.value}
            onChange={tabs.onChange}
            variant="fullWidth"
            slotProps={{ tab: { px: 0 } }}
        >
            {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
        </CustomTabs>
    );

    return (
        <Card
            {...other}
            sx={{
                overflowY: 'scroll', // Always show scrollbar
                maxHeight: '515px', // Fixed height for the container
                '&::-webkit-scrollbar': {
                    width: '8px', // Width of the scrollbar
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent', // Hidden by default
                    borderRadius: '4px',
                    transition: 'background-color 0.3s', // Smooth transition
                },
                '&:hover::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Visible on hover
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
                // Firefox scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent', // Hidden by default
                '&:hover': {
                    scrollbarColor: 'rgba(200, 200, 200, 0.5) transparent', // Visible on hover
                },
            }}
        >
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            {renderTabs}

            <Scrollbar sx={{ minHeight: 384 }}>
                <Box sx={{ p: 3, gap: 3, minWidth: 360, display: 'flex', flexDirection: 'column' }}>
                    {list.map((item) => (
                        <Item key={item.id} item={item} />
                    ))}
                </Box>
            </Scrollbar>
        </Card>
    );
}

function Item({ item, sx, ...other }) {
    console.log('items>>', item);

    return (
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
            <Avatar alt={item.name} src={item.avatarUrl} />
            <div>
                <Box sx={{ mb: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" noWrap>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {item.updatedText}
                    </Typography>

                    <Label color={item.price === 0 ? 'default' : 'default'} sx={{ height: 20 }}>
                        {item.updated}
                    </Label>
                </Box>

                {/* <Typography variant="caption" color="text.disabled">
          {new Date(item.timestamp).toLocaleString()}
        </Typography> */}
                <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                    <Iconify
                        width={16}
                        icon="fluent-mdl2:date-time"
                        sx={{ color: 'text.disabled' }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                </Box>
            </div>
        </Box>
    );
}
