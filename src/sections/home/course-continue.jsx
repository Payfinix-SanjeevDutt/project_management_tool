import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import { Tooltip, useTheme } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { fPercent } from 'src/utils/format-number';

import { varAlpha, stylesMode } from 'src/theme/styles';

import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function CourseContinue({ title, subheader, list, ...other }) {
    const theme = useTheme();
    const carousel = useCarousel({
        loop: true,
        dragFree: true,
        slidesToShow: 'auto',
        slideSpacing: '20px',
    });

    const renderCarousel = (
        <Box sx={{ position: 'relative',  }}>
            <CarouselArrowFloatButtons
                {...carousel.arrows}
                options={carousel.options}
                slotProps={{
                    prevBtn: {
                        svgSize: 14,
                        sx: {
                            p: 0.5,
                            borderRadius: '50%',
                            bgcolor: varAlpha(theme.vars.palette.text.primaryChannel, 0.48),
                            '&:hover': { bgcolor: theme.vars.palette.text.primary },
                        },
                    },
                    nextBtn: {
                        svgSize: 14,
                        sx: {
                            p: 0.5,
                            borderRadius: '50%',
                            bgcolor: varAlpha(theme.vars.palette.text.primaryChannel, 0.48),
                            '&:hover': { bgcolor: theme.vars.palette.text.primary },
                        },
                    },
                }}
            />

            <Carousel carousel={carousel} sx={{ py: 5 }}>
                {list.map((contact, index) => (
                    <Tooltip key={contact.id} title={contact.name} arrow placement="top">
                        <Avatar
                            src={contact.avatarUrl}
                            onClick={() => carousel.dots.onClickDot(index)}
                            sx={{
                                mx: 'auto',
                                opacity: 0.48,
                                cursor: 'pointer',
                                transition: theme.transitions.create('all'),
                                ...(index === carousel.dots.selectedIndex && {
                                    opacity: 1,
                                    transform: 'scale(1.25)',
                                    boxShadow: `-4px 12px 24px 0 ${varAlpha(theme.vars.palette.common.blackChannel, 0.12)}`,
                                    [stylesMode.dark]: {
                                        boxShadow: `-4px 12px 24px 0 ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                                    },
                                }),
                            }}
                        />
                    </Tooltip>
                ))}
            </Carousel>
        </Box>
    );

    /* const renderInput = (
      <>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          insert amount
        </Typography>
  
        <InputAmount
          amount={amount}
          onBlur={handleBlur}
          autoWidth={autoWidth}
          onChange={handleChangeInput}
          sx={{ my: 3 }}
        />
  
        <Slider
          value={typeof amount === 'number' ? amount : 0}
          valueLabelDisplay="auto"
          step={STEP}
          marks
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          onChange={handleChangeSlider}
        />
  
      </>
    ); */
  

    return (
        <Card {...other} sx={{ overflowY: 'scroll', // Always show scrollbar
          maxHeight: '400px', // Fixed height for the container
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
          },}}>
            <CardHeader title={title} subheader={subheader} />

            <Box sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
                {list.map((item) => (
                    <Item key={item.id} item={item} />
                ))}
            </Box>

            {/* <Box sx={{ p: 3 }}>
                <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                        Recent
                    </Typography>

                    {renderCarousel}
                </Box>
            </Box> */}
        </Card>
    );
}

function Item({ item, sx, ...other }) {
    const percent = (item.currentTask / item.totalTask) * 100;

    return (
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ...sx }} {...other}>
            <Avatar
                alt={item.name}
                src={item.coverUrl}
                variant="rounded"
                sx={{ width: 56, height: 56 }}
            />

            <Box sx={{ minWidth: 0, display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
                <Link color="inherit" noWrap sx={{ mb: 0.5, typography: 'subtitle2' }}>
                    {item.name}
                </Link>

                <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
                    Task: {item.currentTask}/{item.totalTask}
                </Box>

                <Box sx={{ width: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress
                        color="warning"
                        variant="determinate"
                        value={percent}
                        sx={{
                            width: 1,
                            height: 6,
                            bgcolor: (theme) =>
                                varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
                            [` .${linearProgressClasses.bar}`]: { opacity: 0.8 },
                        }}
                    />
                    <Box
                        component="span"
                        sx={{
                            width: 40,
                            typography: 'caption',
                            color: 'text.secondary',
                            fontWeight: 'fontWeightMedium',
                        }}
                    >
                        {fPercent(percent)}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
