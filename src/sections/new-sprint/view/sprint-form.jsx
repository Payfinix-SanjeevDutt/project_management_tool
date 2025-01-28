import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { LoadingButton } from '@mui/lab';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import {
    Box,
    Card,
    Stack,
    Button,
    Tooltip,
    MenuItem,
    MenuList,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomPopover } from 'src/components/custom-popover';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StartSprint from '../start-sprint';
import AddDateDialog from '../add-sprint-date';
import SprintTableRow from '../sprint-table-row';
import EditDateDialog from '../edit-date-sprint';
import CreateTaskModal from '../createtask_modal';
import EnhancedTableHead from '../sprint-task-header';

export default function SprintForm() {
    const [tasks, setTasks] = useState([]);
    const [sprints, setSprints] = useState([]);
    const confirmDialog = useBoolean();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('key');
    const [down, setDown] = useState(true);
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [currentSprintId, setCurrentSprintId] = useState(null);
    const [currentSprintNmae, setCurrentSprintName] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [startSprintDate, setStartSprintDate] = useState('');
    const [endSprintDate, setEndSprintDate] = useState('');
    const [bool, setBool] = useState(false);
    const [highlightedSprintId, setHighlightedSprintId] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignee, setAssignee] = useState('Default');
    const [sprintLoading, setSprintLoading] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState(null);
    // const popover = usePopover();
    const [popover, setPopover] = useState({ open: false, anchorEl: null });
    const loading = useBoolean();
    // const buttonColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
    // const [colorIndex, setColorIndex] = useState(0);
    // const sprintLoading = useBoolean();
    const { currentProjectId: project_id } = useSelector((state) => state.projects);
    const project_name = 'PROJECT1';

    console.log('sprints>>', sprints);
    console.log('tasks>>', tasks);
    console.log('startDateTime>>', startDateTime);
    console.log('selectedSprint>>', selectedSprint);
    console.log('project_id>>', project_id);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleCreateSprint = async () => {
        loading.onTrue();

        const sprintPayload = {
            sprint_name: `Sprint ${sprints.length + 1}`,
            description: '' || null,
            project_id,
            start_date: '' || null,
            created_by: '' || null,
            created_at: dayjs(),
            end_date: '' || null,
            actual_start_date: dayjs(),
            actual_end_date: dayjs().add(1, 'week'),
        };

        try {
            const response = await axiosInstance.post(endpoints.sprints.create, sprintPayload);
            console.log('response>>', response);

            const { message, error, data } = response.data;

            if (error === 0) {
                const createdSprint = {
                    sprintId: data.sprint_id,
                    sprintName: data.sprint_name,
                    tasks: 0,
                    open: true,
                };
                console.log('createdSprint>>', createdSprint);

                setSprints([...sprints, createdSprint]);
                setHighlightedSprintId(createdSprint.id);
                toast.success('Sprint created successfully!');
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to process');
        } finally {
            loading.onFalse();
        }
    };

    const getSprints = useCallback(async () => {
        setSprintLoading(true);
        try {
            const response = await axiosInstance.post(
                endpoints.sprints.list,
                {
                    project_id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('listresponse>>', response.data);

            const { message, error, data } = response.data;
            if (error === 0) {
                const formattedData = data.map((sprint) => ({
                    sprintName: sprint.sprint_name || 'Unnamed Sprint',
                    sprintId: sprint.sprint_id || null,
                    startDate: sprint.start_date,
                    endDate: sprint.end_date,
                    // tasks: sprint.mergedTasks?.length || 0,
                    tasks: Array.isArray(sprint.tasks) ? sprint.tasks : [],
                    open: false, // Default state
                }));
                setSprints(formattedData); // Set the sprints data in state
                const allTasks = data.reduce(
                    (acc, sprint) => (sprint.tasks ? [...acc, ...sprint.tasks] : acc),
                    []
                );
                setTasks(allTasks);
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to process');
        } finally {
            setSprintLoading(false);
        }
    }, [project_id]);

    useEffect(() => {
        if (project_id !== '') {
            getSprints(); // Fetch sprints data if project_id is set
        }
    }, [project_id, getSprints]);

    const handleCreateTaskButton = (sprintId) => {
        setCurrentSprintId(sprintId);
        setIsModalOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    useEffect(() => {
        console.log('Current Sprint ID Updated:', currentSprintId);
    }, [currentSprintId]);

    const handleToggleSprint = (sprintId) => {
        // setDown(true)
        setSelectedSprint(sprintId);
        setSprints((prevSprints) => {
            const updatedSprints = prevSprints.map(
                (sprint) =>
                    sprint.sprintId === sprintId
                        ? { ...sprint, open: !sprint.open } // Toggle only the clicked sprint
                        : sprint // Keep other sprints as they are
            );
            return updatedSprints;
        });
    };

    useEffect(() => {
        const timer = highlightedSprintId
            ? setTimeout(() => setHighlightedSprintId(null), 3000)
            : null;

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [highlightedSprintId]);

    const handleClose = (updatedSprint) => {
        setOpen(false);
        setOpenEditDialog(false);

        if (updatedSprint) {
            setSprints((prevData) =>
                prevData.map((sprint) =>
                    sprint.sprintId === updatedSprint.sprintId
                        ? {
                              ...sprint,
                              startDateTime: updatedSprint.startDateTime,
                              endDateTime: updatedSprint.endDateTime,
                          }
                        : sprint
                )
            );
        }
        setCurrentSprintId(null);
    };

    console.log('sprintdate', sprints.start_date);

    const handleStartSprint = (sprintId) => {
        setBool(true);
        setCurrentSprintId(sprintId);
        const selectedSprints = sprints.find((sprint) => sprint.sprintId === sprintId);
        if (selectedSprints) {
            setSelectedSprint(selectedSprints); // Assuming you have a state to store the full sprint data
        }
    };

    const handleCloseSprint = () => {
        setBool(false);
        setCurrentSprintId(null);
    };

    const handleEditSprint = (sprintId) => {
        setOpenEditDialog(true);
        setCurrentSprintId(sprintId);
    };

    const handleClickOpen = (sprintId, sprintName) => {
        setOpen(true);
        setStartDateTime(null);
        setEndDateTime(null);
        setCurrentSprintId(sprintId);
        setCurrentSprintName(sprintName);
    };

    const handleIconButtonClick = (sprintId, event) => {
        // Store the selected sprintId
        setCurrentSprintId(sprintId);

        // Handle opening the popover
        setPopover({
            open: true,
            anchorEl: event.currentTarget, // Set the anchor element for popover
        });
    };

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: { xs: 3, md: 5 } }}
            >
                <CustomBreadcrumbs
                    heading="Backlog"
                    links={[
                        { name: 'Dashboard', href: '/dashboard' },
                        { name: 'Timeline', href: '/timeline' },
                    ]}
                />
                <LoadingButton
                    variant="contained"
                    loading={loading.value}
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleCreateSprint}
                >
                    New Sprint
                </LoadingButton>
            </Stack>

            {sprintLoading ? ( // Display loader when loading is true
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh', // Center the loader vertically
                    }}
                >
                    <CircularProgress color="inherit" />
                </Box>
            ) : (
                <>
                    {/* {down && ( */}
                    <Stack gap={3}>
                        {sprints.length > 0 ? (
                            sprints.map((sprint) => (
                                <Card
                                    key={sprint.sprintId}
                                    ref={(el) => {
                                        if (sprint.id === highlightedSprintId && el) {
                                            el.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'center',
                                            });
                                        }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            py: 2,
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            gap={1}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleToggleSprint(sprint.sprintId)}
                                            >
                                                <Iconify
                                                    icon={
                                                        sprint.open
                                                            ? 'mingcute:down-line'
                                                            : 'mingcute:right-line'
                                                    }
                                                />
                                            </IconButton>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled
                                                style={{
                                                    textTransform: 'none',
                                                    pointerEvents: 'none',
                                                    backgroundColor: '#f0f0f0',
                                                    // backgroundColor: buttonColors[colorIndex],
                                                    color: '#555',
                                                }}
                                            >
                                                {sprint.sprintName}
                                            </Button>
                                            {/* {startDateTime && endDateTime ? (
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    ml={1}
                                                >
                                                    {`${formatDate(new Date(startDateTime))} - ${formatDate(new Date(endDateTime))}`}
                                                </Typography>
                                            ) : (
                                                <Button
                                                    sx={{ color: 'grey' }}
                                                    startIcon={
                                                        <Iconify
                                                            icon="ic:round-edit"
                                                            style={{ color: 'gray' }}
                                                        />
                                                    }
                                                    onClick={() => handleClickOpen(sprint.sprintId, sprint.sprintName)}
                                                >
                                                    Add Dates
                                                </Button>
                                            )} */}
                                            {sprint.startDate && sprint.endDate ? (
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    ml={1}
                                                >
                                                    {`${formatDate(new Date(sprint.startDate))} - ${formatDate(new Date(sprint.endDate))}`}
                                                </Typography>
                                            ) : (
                                                <Button
                                                    sx={{ color: 'grey' }}
                                                    startIcon={
                                                        <Iconify
                                                            icon="ic:round-edit"
                                                            style={{ color: 'gray' }}
                                                        />
                                                    }
                                                    onClick={() =>
                                                        handleClickOpen(
                                                            sprint.sprintId,
                                                            sprint.sprintName
                                                        )
                                                    }
                                                    disabled={sprint.startDate && sprint.endDate} // Disable button if dates are set
                                                >
                                                    Add Dates
                                                </Button>
                                            )}

                                            <Typography
                                                color="textSecondary"
                                                variant="caption"
                                                sx={{ fontWeight: 'normal' }}
                                            >
                                                ({sprint.tasks?.length || 0} Tasks)
                                            </Typography>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            gap={1}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <Tooltip
                                                title={`ToDo (${(sprint.tasks?.filter?.((task) => task.status?.toUpperCase() === 'TODO') || []).length})`}
                                            >
                                                <Label color="default">
                                                    {
                                                        (
                                                            sprint.tasks?.filter?.(
                                                                (task) =>
                                                                    task.status?.toUpperCase() ===
                                                                    'TODO'
                                                            ) || []
                                                        ).length
                                                    }
                                                </Label>
                                            </Tooltip>

                                            <Tooltip
                                                title={`InProgress (${(sprint.tasks?.filter?.((task) => task.status?.toUpperCase() === 'InProgress') || []).length})`}
                                            >
                                                <Label color="info">
                                                    {
                                                        (
                                                            sprint.tasks?.filter?.(
                                                                (task) =>
                                                                    task.status?.toUpperCase() ===
                                                                    'INPROGRESS'
                                                            ) || []
                                                        ).length
                                                    }
                                                </Label>
                                            </Tooltip>
                                            <Tooltip
                                                title={`Done (${(sprint.tasks?.filter?.((task) => task.status?.toUpperCase() === 'Done') || []).length})`}
                                            >
                                                <Label color="success">
                                                    {
                                                        (
                                                            sprint.tasks?.filter?.(
                                                                (task) =>
                                                                    task.status?.toUpperCase() ===
                                                                    'DONE'
                                                            ) || []
                                                        ).length
                                                    }
                                                </Label>
                                            </Tooltip>
                                            {/* {sprint.status === 'Start sprint' && ( */}
                                            <Button
                                                color="inherit"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStartSprint(sprint.sprintId)}
                                                disabled={sprint.tasks.length === 0} // Disable button if tasks array is empty
                                            >
                                                Start Sprint
                                            </Button>
                                            {/* )} */}

                                            <IconButton
                                                color={popover.open ? 'inherit' : 'default'}
                                                onClick={(event) =>
                                                    handleIconButtonClick(sprint.sprintId, event)
                                                } // Store sprintId on click
                                            >
                                                <Iconify icon="eva:more-vertical-fill" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                    {sprint.open && (
                                        <>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <EnhancedTableHead
                                                        open={open}
                                                        order={order}
                                                        orderBy={orderBy}
                                                        onRequestSort={handleRequestSort}
                                                    />
                                                    <TableBody>
                                                        {Array.isArray(sprint.tasks) &&
                                                        sprint.tasks.length > 0 ? (
                                                            sprint.tasks.map((task) => (
                                                                <SprintTableRow
                                                                    key={task.task_id}
                                                                    task={task}
                                                                />
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell
                                                                    colSpan={14}
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    <EmptyContent filled />
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Box sx={{ m: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() =>
                                                        handleCreateTaskButton(sprint.sprintId)
                                                    }
                                                >
                                                    Create Task
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <Typography>No sprints are available.</Typography>
                        )}
                    </Stack>

                    {popover.open && (
                        <CustomPopover
                            open={popover.open}
                            anchorEl={popover.anchorEl}
                            onClose={() => setPopover({ open: false, anchorEl: null })}
                        >
                            <MenuList>
                                <MenuItem
                                    onClick={() => {
                                        if (currentSprintId) {
                                            handleEditSprint(currentSprintId);
                                            setPopover({ open: false, anchorEl: null });
                                        }
                                    }}
                                >
                                    <Iconify icon="solar:eraser-bold" />
                                    Edit
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        confirmDialog.onTrue();
                                        setPopover({ open: false, anchorEl: null });
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </CustomPopover>
                    )}
                    <StartSprint
                        open={bool}
                        onClose={handleCloseSprint}
                        setBool={setBool}
                        setCurrentSprintId={setCurrentSprintId}
                        items={currentSprintId}
                        startDateTime={startSprintDate}
                        setStartDateTime={setStartSprintDate}
                        endDateTime={endSprintDate}
                        setEndDateTime={setEndSprintDate}
                        taskCount={selectedSprint?.tasks?.length || 0}
                        getSprints={getSprints}
                        sprintData={sprints}
                    />
                    <AddDateDialog
                        open={open}
                        onClose={handleClose}
                        setOpen={setOpen}
                        setCurrentSprintId={setCurrentSprintId}
                        items={currentSprintNmae}
                        startDateTime={startDateTime}
                        sprintid={currentSprintId}
                        setStartDateTime={setStartDateTime}
                        endDateTime={endDateTime}
                        setEndDateTime={setEndDateTime}
                        getSprints={getSprints}
                    />
                    {isModalOpen && (
                        <CreateTaskModal
                            open={isModalOpen}
                            assignee={assignee}
                            setAssignee={setAssignee}
                            setSprints={setSprints}
                            sprints={sprints}
                            setIsModalOpen={setIsModalOpen}
                            setTasks={setTasks}
                            currentSprintId={currentSprintId}
                            getSprints={getSprints}
                        />
                    )}

                    {openEditDialog && (
                        <EditDateDialog
                            open={openEditDialog}
                            onClose={handleClose}
                            setOpenEditDialog={setOpenEditDialog}
                            items={currentSprintId}
                            sprintData={sprints}
                            getSprints={getSprints}
                        />
                    )}
                    {/* )} */}
                </>
            )}
        </DashboardContent>
    );
}
