import React, { useRef, useState, useEffect } from 'react';

// import { formatDate } from '@fullcalendar/core';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
    Box,
    Card,
    Stack,
    Avatar,
    Tooltip,
    MenuItem,
    useTheme,
    MenuList,
    TextField,
    IconButton,
    Typography,
    AvatarGroup,
    InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import StartSprint from '../start-sprint';
import AddDateDialog from '../add-sprint-date';
import EditDateDialog from '../edit-date-sprint';
import SprintIssuesList from '../sprint-issues-list';

export default function BacklogForm() {
    const theme = useTheme();
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [openSprint, setOpenSprint] = useState({});
    const [checked, setChecked] = useState({});
    const popover = usePopover();
    const confirmDialog = useBoolean();
    const [newIssueInput, setNewIssueInput] = useState({});
    const inputRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [bool, setBool] = useState(false);
    const [currentSprintId, setCurrentSprintId] = useState(null);
    const [issueCount, setIssueCount] = useState(0);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [startSprintDate, setStartSprintDate] = useState('');
    const [endSprintDate, setEndSprintDate] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);

    console.log('currentSprintId', currentSprintId);

    const handleToggleSprint = (sprintId) => () => {
        setOpenSprint((prev) => ({
            ...prev,
            [sprintId]: !prev[sprintId],
        }));
    };

    const [sprintData, setSprintData] = useState([
        { id: 1, name: 'Sprint1', status: 'Start sprint' },
        { name: 'Backlog', status: 'Create sprint' },
    ]);

    const [issues, setIssues] = useState({
        1: [
            { id: 1, name: 'issue1', status: 'todo', assign: 1 },
            { id: 2, name: 'issue2', status: 'todo', assign: 2 },
        ],
    });
    console.log('issues>>', issues);

    useEffect(() => {
        const countIssuesInSprint = (sprintId) => issues[sprintId]?.length || 0;
        const newIssueCounts = {};
        sprintData.forEach((sprint) => {
            if (sprint.id) {
                newIssueCounts[sprint.id] = countIssuesInSprint(sprint.id);
            }
        });
        setIssueCount(newIssueCounts);
    }, [issues, sprintData]);

    console.log('issueCount', issueCount);

    const handleCheckBoxChange = (sprintId, issueId) => (event) => {
        const isChecked = event.target.checked;
        setChecked((prev) => ({
            ...prev,
            [sprintId]: {
                ...prev[sprintId],
                [issueId]: isChecked,
            },
        }));
    };

    const handleSelectAllInSprint = (sprintId) => (event) => {
        const isChecked = event.target.checked;
        setChecked((prev) => {
            const sprintIssues = issues[sprintId];
            const updatedIssues = Object.keys(sprintIssues).reduce((acc, issueId) => {
                acc[issueId] = isChecked;
                return acc;
            }, {});

            return {
                ...prev,
                [sprintId]: updatedIssues,
            };
        });
    };

    const handleCreateSprint = () => {
        const sprintCount = sprintData.filter((item) => item.name !== 'Backlog').length;
        const newSprintId = sprintCount + 1;
        const newSprint = {
            id: newSprintId,
            name: `Sprint${newSprintId}`,
            status: 'Start sprint',
        };
        const updatedSprintData = [
            ...sprintData.slice(0, sprintData.length - 1),
            newSprint,
            sprintData[sprintData.length - 1],
        ];

        setSprintData(updatedSprintData);
        setOpenSprint({ [newSprintId]: true });
        setIssues({ ...issues, [newSprintId]: {} });
        setChecked({ ...checked, [newSprintId]: {} });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setNewIssueInput({});
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOpen = (id) => {
        setOpen(true);
        setCurrentSprintId(id);
    };

    const handleStartSprint = (id) => {
        setBool(true);
        setCurrentSprintId(id);
    };

    const handleCloseSprint = () => {
        setOpen(false);
        setCurrentSprintId(null);
    };

    const handleEditSprint = (id) => {
        setOpenEditDialog(true);
        setCurrentSprintId(id);
    };

    const handleClose = (updatedSprint) => {
        setOpen(false);
        setOpenEditDialog(false);

        if (updatedSprint) {
            setSprintData((prevData) =>
                prevData.map((sprint) =>
                    sprint.id === updatedSprint.id
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

    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <Stack gap={3}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'normal',
                        gap: 3,
                    }}
                >
                    <TextField
                        sx={{ width: 300 }}
                        // value={filters.name}
                        // onChange={handleFilterName}
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify
                                        icon="eva:search-fill"
                                        sx={{ color: 'text.disabled' }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        autoFocus
                    />

                    <AvatarGroup max={4}>
                        <Avatar
                            alt="110 Lamar Station Apt. 730 - Hagerstown, OK / 49808"
                            // src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-4.webp"
                        />
                        <Avatar
                            alt="18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337"
                            // src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-3.webp"
                        />
                        <Avatar
                            alt="1147 Rohan Drive Suite 819 - Burlington, VT / 82021"
                            // src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-2.webp"
                        />
                        <Avatar>+4</Avatar>
                    </AvatarGroup>
                </Box>
                {sprintData.map((item, index) => (
                    <Stack
                        component={Card}
                        key={index}
                        spacing={1}
                        direction="column"
                        sx={{ p: 2 }}
                    >
                        <Box
                            sx={{
                                // border: '1px solid black',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <Checkbox
                                    {...label}
                                    onChange={handleSelectAllInSprint(item.id)}
                                    checked={
                                        checked[item.id] && Object.keys(checked[item.id]).length > 0
                                            ? Object.values(checked[item.id]).every(Boolean)
                                            : false
                                    }
                                    indeterminate={
                                        checked[item.id] && Object.keys(checked[item.id]).length > 0
                                            ? Object.values(checked[item.id]).some(Boolean) &&
                                              !Object.values(checked[item.id]).every(Boolean)
                                            : false
                                    }
                                />
                                <IconButton size="small" onClick={handleToggleSprint(item.id)}>
                                    {openSprint[item.id] ? <ExpandMore /> : <ExpandLess />}
                                </IconButton>

                                <Typography variant="subtitle1">{item.name}</Typography>
                                {item.name !== 'Backlog' &&
                                item.startDateTime &&
                                item.endDateTime ? (
                                    <Typography variant="caption" color="textSecondary" ml={1}>
                                        {`${formatDate(new Date(item.startDateTime))} - ${formatDate(new Date(item.endDateTime))}`}
                                    </Typography>
                                ) : (
                                    item.name !== 'Backlog' && (
                                        <Button
                                            sx={{ color: 'grey' }}
                                            startIcon={
                                                <Iconify icon="ic:round-edit"  style={{color: 'gray'}}  />
                                            }
                                            onClick={() => handleClickOpen(item.id)}
                                        >
                                        Add Dates
                                        </Button>
                                    )
                                )}

                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                    sx={{ fontWeight: 'normal' }}
                                >
                                    {issueCount[item.id]
                                        ? `(${issueCount[item.id]} issues)`
                                        : '(0 issues)'}
                                </Typography>

                                <AddDateDialog
                                    open={open}
                                    onClose={handleClose}
                                    setOpen={setOpen}
                                    setCurrentSprintId={setCurrentSprintId}
                                    items={currentSprintId}
                                    startDateTime={startDateTime}
                                    setStartDateTime={setStartDateTime}
                                    endDateTime={endDateTime}
                                    setEndDateTime={setEndDateTime}
                                />
                            </Stack>
                            <Stack
                                direction="row"
                                gap={1}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <Tooltip title="ToDo(0)">
                                    <Label color="default">{0}</Label>
                                </Tooltip>
                                <Tooltip title="InProgress(0)">
                                    <Label color="info">{0}</Label>
                                </Tooltip>
                                <Tooltip title="Done(0)">
                                    <Label color="success">{0}</Label>
                                </Tooltip>

                                {item.status === 'Start sprint' && (
                                    <Button
                                        color="inherit"
                                        size="small"
                                        variant="outlined"
                                        // loading={loadingSave.value && isSubmitting}
                                        onClick={() => handleStartSprint(item.id)}
                                    >
                                        Start sprint
                                    </Button>
                                )}

                                {item.status === 'Create sprint' && (
                                    <Button
                                        color="inherit"
                                        size="small"
                                        variant="outlined"
                                        // loading={loadingSave.value && isSubmitting}
                                        onClick={handleCreateSprint}
                                    >
                                        Create sprint
                                    </Button>
                                )}

                                <StartSprint
                                    open={bool}
                                    onClose={handleCloseSprint}
                                    setOpen={setBool}
                                    setCurrentSprintId={setCurrentSprintId}
                                    items={currentSprintId}
                                    startDateTime={startSprintDate}
                                    setStartDateTime={setStartSprintDate}
                                    endDateTime={endSprintDate}
                                    setEndDateTime={setEndSprintDate}
                                    issueCount={issueCount}
                                    // items={item.id}
                                />

                                {item.name !== 'Backlog' && (
                                    <IconButton
                                        color={popover.open ? 'inherit' : 'default'}
                                        onClick={popover.onOpen}
                                    >
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>
                                )}
                            </Stack>
                        </Box>

                        <SprintIssuesList
                            items={item.id}
                            openSprint={openSprint}
                            handleCheckBoxChange={handleCheckBoxChange}
                            issues={issues}
                            setIssues={setIssues}
                            setChecked={setChecked}
                            checked={checked}
                        />

                        {openEditDialog && (
                            <EditDateDialog
                                open={openEditDialog}
                                onClose={handleClose}
                                setOpen={setOpen}
                                setCurrentSprintId={setCurrentSprintId}
                                items={currentSprintId}
                                startDateTime={startDateTime}
                                setStartDateTime={setStartDateTime}
                                endDateTime={endDateTime}
                                setEndDateTime={setEndDateTime}
                            />
                        )}

                        <CustomPopover
                            open={popover.open}
                            anchorEl={popover.anchorEl}
                            onClose={popover.onClose}
                        >
                            <MenuList>
                                <MenuItem
                                    onClick={() => {
                                        handleEditSprint(item.id); // Ensure you pass the correct item.id
                                        popover.onClose();
                                    }}
                                >
                                    <Iconify icon="solar:eraser-bold" />
                                    Edit
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        confirmDialog.onTrue();
                                        popover.onClose();
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </CustomPopover>
                    </Stack>
                ))}
            </Stack>

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title="Delete Sprint"
                content={
                    <>
                        Are you sure you want to delete sprint <strong>Sprint 1?</strong>
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            // onDeleteColumn?.();
                            confirmDialog.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
