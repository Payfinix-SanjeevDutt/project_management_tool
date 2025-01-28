import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';


// ----------------------------------------------------------------------

export function CourseWidgetSummary({ sx, icon, title, total, color = 'warning', ...other }) {
    const theme = useTheme();

    return (
        <Card sx={{ py: 3, pl: 3, pr: 2.5, ...sx, height: 155 }} {...other}>
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>{title}</Box>
                <Box sx={{ my: 1.5, typography: 'h3' }}>{fNumber(total)}</Box>
                {/* <Box sx={{ typography: 'h3', mt:3 }}>{fNumber(total)}</Box>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography> */}
            </Box>

            {/* <SvgColor
        src={icon}
        sx={{
          top: 24,
          right: 20,
          width: 36,
          height: 36,
          position: 'absolute',
          background: `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
        }}
      /> */}

            <Box
                sx={{
                  top: 2,
                  right: 5,
                  width: 100,
                  height: 120,
                    position: 'absolute',
                    lineHeight: 0,
                }}
            >
                {icon}
            </Box>

            <Box
                sx={{
                    top: -44,
                    width: 200,
                    zIndex: -1,
                    height: 200,
                    right: -104,
                    opacity: 0.12,
                    borderRadius: 3,
                    position: 'absolute',
                    transform: 'rotate(40deg)',
                    background: `linear-gradient(to right, ${theme.vars.palette[color].main} 0%, ${varAlpha(theme.vars.palette[color].mainChannel, 0)} 100%)`,
                }}
            />
        </Card>
    );
}
