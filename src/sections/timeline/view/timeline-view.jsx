import Calendar from '@fullcalendar/react'; // => request placed at the top

import { useEffect } from 'react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fDate, fIsAfter, fIsBetween } from 'src/utils/format-time';

import { updateEvent } from 'src/actions/calendar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StyledCalendar } from '../styles';
import { useEvent } from '../hooks/use-event';
import { TimelineForm } from '../timeline-form';
import { useCalendar } from '../hooks/use-calendar';
import { TimelineFilters } from '../timeline-filters';
import { TimelineToolbar } from '../timeline-toolbar';
import { TimelineFiltersResult } from '../timeline-filters-result';

// ----------------------------------------------------------------------

const events = [
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        title: 'Summer Music Festival',
        allDay: false,
        color: '#00A76F',
        description:
            'Atque eaque ducimus minima distinctio velit. Laborum et veniam officiis. Delectus ex saepe hic id laboriosam officia. Odit nostrum qui illum saepe debitis ullam. Laudantium beatae modi fugit ut. Dolores consequatur beatae nihil voluptates rem maiores.',
        start: '2024-11-02T05:50:08+00:00',
        end: '2024-11-02T09:20:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        title: 'Tech Innovators Conference',
        allDay: false,
        color: '#00B8D9',
        description:
            'Rerum eius velit dolores. Explicabo ad nemo quibusdam. Voluptatem eum suscipit et ipsum et consequatur aperiam quia. Rerum nulla sequi recusandae illum velit quia quas. Et error laborum maiores cupiditate occaecati.',
        start: '2024-11-08T05:50:08+00:00',
        end: '2024-11-08T09:20:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        title: 'Charity Gala Dinner',
        allDay: false,
        color: '#22C55E',
        description:
            'Et non omnis qui. Qui sunt deserunt dolorem aut velit cumque adipisci aut enim. Nihil quis quisquam nesciunt dicta nobis ab aperiam dolorem repellat. Voluptates non blanditiis. Error et tenetur iste soluta cupiditate ratione perspiciatis et. Quibusdam aliquid nam sunt et quisquam non esse.',
        start: '2024-11-17T09:20:08+00:00',
        end: '2024-11-17T13:35:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        title: 'Spring Art Exhibition',
        allDay: false,
        color: '#8E33FF',
        description:
            'Nihil ea sunt facilis praesentium atque. Ab animi alias sequi molestias aut velit ea. Sed possimus eos. Et est aliquid est voluptatem.',
        start: '2024-11-14T05:20:08+00:00',
        end: '2024-11-14T09:20:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        title: 'Corporate Training Workshop',
        allDay: false,
        color: '#FFAB00',
        description:
            'Non rerum modi. Accusamus voluptatem odit nihil in. Quidem et iusto numquam veniam culpa aperiam odio aut enim. Quae vel dolores. Pariatur est culpa veritatis aut dolorem.',
        start: '2024-11-17T09:20:08+00:00',
        end: '2024-11-17T09:50:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        title: 'Community Health Fair',
        allDay: true,
        color: '#FF5630',
        description:
            'Est enim et sit non impedit aperiam cumque animi. Aut eius impedit saepe blanditiis. Totam molestias magnam minima fugiat.',
        start: '2024-11-11T00:00:00+00:00',
        end: '2024-11-11T23:59:59+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        title: 'Startup Pitch Night',
        allDay: false,
        color: '#003768',
        description:
            'Unde a inventore et. Sed esse ut. Atque ducimus quibusdam fuga quas id qui fuga.',
        start: '2024-11-17T09:35:08+00:00',
        end: '2024-11-17T09:50:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
        title: 'Regional Sports Tournament',
        allDay: false,
        color: '#00B8D9',
        description:
            'Eaque natus adipisci soluta nostrum dolorem. Nesciunt ipsum molestias ut aliquid natus ut omnis qui fugiat. Dolor et rem. Ut neque voluptatem blanditiis quasi ullam deleniti.',
        start: '2024-11-17T10:05:08+00:00',
        end: '2024-11-17T10:15:08+00:00',
    },
    {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
        title: 'Book Launch Event',
        allDay: false,
        color: '#7A0916',
        description:
            'Nam et error exercitationem qui voluptate optio. Officia omnis qui accusantium ipsam qui. Quia sequi nulla perspiciatis optio vero omnis maxime omnis ipsum. Perspiciatis consequuntur asperiores veniam dolores.',
        start: '2024-11-20T09:30:08+00:00',
        end: '2024-11-20T09:40:08+00:00',
    },
];

export function TimelineView() {
    const theme = useTheme();

    const openFilters = useBoolean();

    // const { events, eventsLoading } = useGetEvents();

    const filters = useSetState({
        colors: [],
        startDate: null,
        endDate: null,
    });

    const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

    const {
        calendarRef,
        //
        view,
        date,
        //
        onDatePrev,
        onDateNext,
        onDateToday,
        onDropEvent,
        onChangeView,
        onSelectRange,
        onClickEvent,
        onResizeEvent,
        onInitialView,
        //
        openForm,
        onOpenForm,
        onCloseForm,
        //
        selectEventId,
        selectedRange,
        //
        onClickEventInFilters,
    } = useCalendar();

    const currentEvent = useEvent(events, selectEventId, selectedRange, openForm);

    const sprints = [
        { id: 'sprint1', title: 'Sprint 1' },
        { id: 'sprint2', title: 'Sprint 2' },
        { id: 'sprint3', title: 'Sprint 3' },
        // Add more sprints as needed
    ];

    useEffect(() => {
        onInitialView();
    }, [onInitialView]);

    const canReset =
        filters.state.colors.length > 0 || (!!filters.state.startDate && !!filters.state.endDate);

    const dataFiltered = applyFilter({ inputData: events, filters: filters.state, dateError });

    const renderResults = (
        <TimelineFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            sx={{ mb: { xs: 3, md: 5 } }}
        />
    );

    const flexProps = { flex: '1 1 auto', display: 'flex', flexDirection: 'column' };

    return (
        <>
            <DashboardContent maxWidth="xl" sx={{ ...flexProps }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: { xs: 3, md: 5 } }}
                >
                    <CustomBreadcrumbs
                        heading="Timeline"
                        links={[
                            { name: 'Dashboard', href: paths.dashboard },
                            { name: 'Timeline', href: paths.dashboard },
                            // { name: 'Scan-now' },
                        ]}
                        sx={{
                            mb: { xs: 3, md: 5 },
                        }}
                    />
                    {/* <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={onOpenForm}
                    >
                        New event
                    </Button> */}
                </Stack>

                {canReset && renderResults}
                <Card
                    sx={{
                        ...flexProps,
                        minHeight: '75vh',
                    }}
                >
                    <StyledCalendar
                        sx={{ ...flexProps, '.fc.fc-media-screen': { flex: '1 1 auto' } }}
                    >
                        <TimelineToolbar
                            date={fDate(date)}
                            view={view}
                            canReset={canReset}
                            // loading={eventsLoading}
                            onNextDate={onDateNext}
                            onPrevDate={onDatePrev}
                            onToday={onDateToday}
                            onChangeView={onChangeView}
                            onOpenFilters={openFilters.onTrue}
                        />

                        <Calendar
                            weekends
                            editable
                            droppable
                            selectable
                            rerenderDelay={10}
                            allDayMaintainDuration
                            eventResizableFromStart
                            ref={calendarRef}
                            initialDate={date}
                            initialView={view}
                            dayMaxEventRows={3}
                            eventDisplay="block"
                            events={dataFiltered}
                            headerToolbar={false}
                            select={onSelectRange}
                            eventClick={onClickEvent}
                            aspectRatio={3}
                            eventDrop={(arg) => {
                                onDropEvent(arg, updateEvent);
                            }}
                            eventResize={(arg) => {
                                onResizeEvent(arg, updateEvent);
                            }}
                            plugins={[
                                listPlugin,
                                dayGridPlugin,
                                timelinePlugin,
                                timeGridPlugin,
                                interactionPlugin,
                            ]}
                        />
                    </StyledCalendar>
                </Card>
            </DashboardContent>

            <Dialog
                fullWidth
                maxWidth="xs"
                open={openForm}
                onClose={onCloseForm}
                transitionDuration={{
                    enter: theme.transitions.duration.shortest,
                    exit: theme.transitions.duration.shortest - 80,
                }}
                PaperProps={{
                    sx: {
                        display: 'flex',
                        overflow: 'hidden',
                        flexDirection: 'column',
                        '& form': {
                            minHeight: 0,
                            display: 'flex',
                            flex: '1 1 auto',
                            flexDirection: 'column',
                        },
                    },
                }}
            >
                <DialogTitle sx={{ minHeight: 76 }}>
                    {openForm && <> {currentEvent?.id ? 'Edit' : 'Add'} event</>}
                </DialogTitle>

                <TimelineForm
                    currentEvent={currentEvent}
                    colorOptions={CALENDAR_COLOR_OPTIONS}
                    onClose={onCloseForm}
                />
            </Dialog>

            <TimelineFilters
                events={events}
                filters={filters}
                canReset={canReset}
                dateError={dateError}
                open={openFilters.value}
                onClose={openFilters.onFalse}
                onClickEvent={onClickEventInFilters}
                colorOptions={CALENDAR_COLOR_OPTIONS}
            />
        </>
    );
}

function applyFilter({ inputData, filters, dateError }) {
    const { colors, startDate, endDate } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    inputData = stabilizedThis.map((el) => el[0]);

    if (colors.length) {
        inputData = inputData.filter((event) => colors.includes(event.color));
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter((event) => fIsBetween(event.start, startDate, endDate));
        }
    }

    return inputData;
}
