import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { alpha, useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { bgGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export function BookingTotalIncomes({ title, total, percent, chart, sx, ...other }) {
    const theme = useTheme();
    const color = 'primary';
    const chartColors = chart.colors ?? [hexAlpha(theme.palette.primary.lighter, 0.64)];

    const chartOptions = useChart({
        chart: { sparkline: { enabled: true } },
        colors: chartColors,
        stroke: { width: 3 },
        grid: {
            padding: {
                top: 6,
                left: 6,
                right: 6,
                bottom: 6,
            },
        },
        xaxis: { categories: chart.categories },
        tooltip: {
            y: { formatter: (value) => `${value} tasks`, title: { formatter: () => '' } },
        },
        ...chart.options,
    });

    const renderTrending = (
        <Box gap={0.5} display="flex" alignItems="flex-end" flexDirection="column">
            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
                <Iconify icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
                <Box component="span">
                    {percent > 0 && '+'}
                    {fPercent(percent)}
                </Box>
            </Box>
            <Box component="span" sx={{ opacity: 0.64, typography: 'body2' }}>
                last month
            </Box>
        </Box>
    );

    return (
        <Card
            sx={{
                ...bgGradient({
                    direction: '135deg',
                    startColor: alpha(theme.palette.success.light, 0.2), // Light green
                    endColor: alpha(theme.palette.success.main, 0.5), // Dark green
                }),
                p: 3,
                borderRadius: 2,
                boxShadow: 'none',
                color: `${color}.darker`,
                ...sx,
            }}
            {...other}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
                    <Box sx={{ typography: 'h3' }}>{total}</Box>
                </div>

                {renderTrending}
            </Box>

            <Chart type="line" series={chart.series} options={chartOptions} height={120} />

            <SvgColor
                src={`${CONFIG.site.basePath}/assets/background/shape-square.svg`}
                sx={{
                    top: 0,
                    left: 0,
                    width: 280,
                    zIndex: -1,
                    height: 280,
                    opacity: 0.08,
                    position: 'absolute',
                    color: 'primary.lighter',
                    transform: 'rotate(90deg)',
                }}
            />
        </Card>
    );
}
