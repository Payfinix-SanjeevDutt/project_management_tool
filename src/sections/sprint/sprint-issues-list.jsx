import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {
    Box,
    Stack,
    Modal,
    Avatar,
    MenuItem,
    MenuList,
    TextField,
    IconButton,
    Typography,
    Autocomplete,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import SprintEdit from './sprint-issues-details';

const STATUS_TYPE = [
    { id: 'todo', label: 'To Do', color: 'default' },
    { id: 'inprogress', label: 'In Progress', color: 'info' },
    { id: 'done', label: 'Done', color: 'success' },
];

const EMPLOYEES = [
    {
        id: 1,
        name: 'smith',
        avatar: '',
    },
    {
        id: 2,
        name: 'Jone',
        avatar: '',
    },
    {
        id: 3,
        name: 'Nivi',
        avatar: '',
    },
];

export default function SprintIssuesList({
    items,
    openSprint,
    handleCheckBoxChange,
    setIssues,
    issues,
    setChecked,
    checked,
}) {
    // const popover = usePopover();
    const confirmDialog = useBoolean();
    const [newIssueInput, setNewIssueInput] = useState({ 1: '' });
    const [issueText, setIssueText] = useState({ 1: false });
    const [issueStatus, setIssueStatus] = useState({});
    const inputRef = useRef(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIssues, setSelectedIssues] = useState(null);
    const [selectedKey, setSelectedKey] = useState(1);

    const [openModal, setOpenModal] = useState(false);
    const [popover, setPopover] = useState({
        open: false,
        anchorEl: null,
        onClose: () => setPopover({ ...popover, open: false }),
    });

    const handleEditClick = (valueKey) => {
        setPopover({ ...popover, open: false });
        setOpenModal(true);
        const { name: issueName, status, assign } = issues[items][valueKey];
        const assignedEmployee = EMPLOYEES.filter((it) => it.id === assign)[0];
        const assignedEmployeeName = assignedEmployee ? assignedEmployee.name : null;
        setSelectedIssues([{ issueName, status, assignedEmployeeName }]);
        setSelectedItem(valueKey);
    };

    // const handleEditClick = (issue) => {
    //     console.log('Edit clicked for:', issue);
    //     setPopover({ ...popover, open: false });
    //     setOpenModal(true);
    //     setSelectedIssues(issue); // Store the specific issue data in state
    // };

    const handleDeleteClick = (valueKey) => {
        // Store the ID of the issue to be deleted
        setDialogOpen({
            value: true,
            onConfirm: () => {
                const updatedIssues = { ...issues[items] };
                delete updatedIssues[valueKey];
                setIssues(updatedIssues);
            },
        });
    };
    

    const handleModalClose = () => {
        setOpenModal(false);
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

    console.log('issues>>', issues);

    const handleInputChange = (sprintId, e) => {
        setIssueText((prev) => ({
            ...prev,
            [sprintId]: e.target.value,
        }));
    };

    const getNextIssueId = (issuesArray) => {
        if (!Array.isArray(issuesArray) || issuesArray.length === 0) return 1;

        const currentIds = issuesArray.map((issue) => issue.id);
        return Math.max(...currentIds) + 1;
    };

    const handleKeyPress = (sprintId, e) => {
        if (e.key === 'Enter' && issueText[sprintId]) {
            const newIssueId = getNextIssueId(issues[sprintId]);
            const newIssue = {
                id: newIssueId,
                name: issueText[sprintId],
                status: issueStatus[sprintId] || 'todo',
                assign: 1,
            };

            setIssues((prev) => ({
                ...prev,
                [sprintId]: [...(Array.isArray(prev[sprintId]) ? prev[sprintId] : []), newIssue],
            }));
            setIssueText((prev) => ({ ...prev, [sprintId]: '' }));
            setNewIssueInput((prev) => ({ ...prev, [sprintId]: false }));
        }
    };

    const handleStatusChange = (key, newStatusId) => {
        setIssueStatus((prev) => ({
            ...prev,
            [key]: newStatusId,
        }));
        setIssues((prevIssues) => ({
            ...prevIssues,
            [items]: {
                ...prevIssues[items],
                [key]: {
                    ...prevIssues[items][key],
                    status: newStatusId,
                },
            },
        }));
    };

    const handleCreateIssue = (sprintId) => {
        setNewIssueInput((prev) => ({
            ...prev,
            [sprintId]: true,
        }));

        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIssueKey, setSelectedIssueKey] = useState(null);

    const handleClick = (event, key) => {
        setAnchorEl(event.currentTarget);
        setSelectedIssueKey(key);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIssueKey(null);
    };

    const handlePopoverOpen = (event) => {
        setPopover({
            open: true,
            anchorEl: event.currentTarget,
        });
    };

    const handleMenuItemClick = (option) => {
        if (selectedIssueKey) {
            handleStatusChange(selectedIssueKey, option.id);
        }
        handleClose();
    };
    return (
        <>
            {openSprint[items] && (
                <Stack direction="column" gap={2}>
                    <Box sx={{ border: '1px solid #f4f4f4', borderRadius: 1 }}>
                        {issues[items] &&
                            Object.entries(issues[items]).map(([valueKey, valuePair]) => (
                                <Stack
                                    key={valueKey}
                                    direction="row"
                                    // onClick={() => handleDialogOpen(valueKey)}
                                    sx={{
                                        p: 0.5,
                                        borderRadius: 0.5,
                                        height: '40px',
                                        // backgroundColor:
                                        //     selectedItem === valueKey
                                        //         ? 'rgba(0, 123, 255, 0.2)'
                                        //         : checked[items]?.[valueKey]
                                        //           ? 'rgba(0, 123, 255, 0.1)'
                                        //           : 'inherit',
                                        alignItems: 'center',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 123, 255, 0.05)',
                                        },
                                    }}
                                    spacing={3}
                                >
                                    <Checkbox
                                        checked={checked[items]?.[valueKey] || false}
                                        onChange={handleCheckBoxChange(items, valueKey)}
                                    />

                                    <Typography width="650px">{valuePair.name}</Typography>

                                    <Label sx={{ ml: 5 }}>{valuePair.status}</Label>

                                    {/* <Button
                                        variant="contained"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleClick(event, valueKey);
                                        }}
                                        endIcon={<ArrowDropDownIcon />}
                                        labelId="status-label"
                                        id={`status-${valueKey}`}
                                        sx={{
                                            width: '130px',
                                            height: '25',
                                            bgcolor: (() => {
                                                const status =
                                                    issueStatus[valueKey] || valuePair.status;
                                                switch (status) {
                                                    case 'todo':
                                                        return 'gray';
                                                    case 'inprogress':
                                                        return 'info.main';
                                                    case 'done':
                                                        return 'success.main';
                                                    default:
                                                        return 'gray';
                                                }
                                            })(),
                                            color: 'white',
                                        }}
                                    >
                                        {issueStatus[valueKey] &&
                                        STATUS_TYPE.find(
                                            (option) => option.id === issueStatus[valueKey]
                                        )
                                            ? STATUS_TYPE.find(
                                                  (option) => option.id === issueStatus[valueKey]
                                              ).label
                                            : STATUS_TYPE[0].label}{' '}
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedIssueKey === valueKey}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        {STATUS_TYPE.map((option) => (
                                            <MenuItem
                                                key={option.id}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleMenuItemClick(option);
                                                }}
                                            >
                                                <Box
                                                    component="li"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Label color={option.color}>
                                                        {option.label}
                                                    </Label>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Menu> */}

                                    <Autocomplete
                                        id="assignnees"
                                        sx={{ minWidth: 200 }}
                                        options={EMPLOYEES}
                                        value={
                                            EMPLOYEES.filter((it) => it.id === valuePair.assign)[0]
                                        }
                                        disableClearable
                                        popupIcon={null}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => {
                                            const { key, ...optionProps } = props;
                                            return (
                                                <Stack
                                                    key={key}
                                                    component="li"
                                                    gap={1}
                                                    direction="row"
                                                    alignItems="center"
                                                    {...optionProps}
                                                >
                                                    <Avatar
                                                        alt={option.name}
                                                        src={option.avatar || undefined}
                                                    >
                                                        {option.avatar
                                                            ? null
                                                            : option.name.charAt(0)}{' '}
                                                    </Avatar>
                                                    <Typography>{option.name}</Typography>{' '}
                                                </Stack>
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <Avatar
                                                            alt={params.inputProps.value}
                                                            src={
                                                                params.inputProps.value.avatar ||
                                                                undefined
                                                            }
                                                            sx={{
                                                                width: 24, // Set the width to a smaller size
                                                                height: 24, // Set the height to a smaller size
                                                                // mr: 1
                                                            }}
                                                        >
                                                            {params.inputProps.value.avatar
                                                                ? null
                                                                : params.inputProps.value.charAt(0)}
                                                        </Avatar>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            border: 'none',
                                                        },
                                                        '&:hover fieldset': {
                                                            border: 'none',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: 'none',
                                                            // border: '2px solid black',
                                                        },
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                    <IconButton
                                        color={popover.open ? 'inherit' : 'default'}
                                        // onClick={(event) => popover.onOpen(event)}
                                        onClick={handlePopoverOpen}
                                    >
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>
                                </Stack>
                            ))}
                    </Box>
                    {newIssueInput[items] ? (
                        <TextField
                            inputRef={inputRef}
                            value={issueText[items] || ''}
                            onChange={(e) => handleInputChange(items, e)}
                            onKeyPress={(e) => handleKeyPress(items, e)}
                            placeholder="What needs to be Done?"
                            sx={{ width: '100%' }}
                        />
                    ) : (
                        <Button
                            variant="outlined"
                            sx={{ maxWidth: 130 }}
                            onClick={() => handleCreateIssue(items)}
                        >
                            <Iconify icon="ic:outline-add" />
                            Create Issue
                        </Button>
                    )}
                </Stack>
            )}
            <Modal open={openModal} onClose={handleModalClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        minHeight: '90vh',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <SprintEdit
                        issueDeatils={selectedIssues}
                        items={items}
                        handleModalClose={handleModalClose}
                    />
                </Box>
            </Modal>
            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
            >
                <MenuList>
                    {issues[items] &&
                        Object.keys(issues[items])
                            .slice(0, 1) // Limit to the first item
                            .map((valueKey) => (
                                <MenuItem key={valueKey} onClick={() => handleEditClick(valueKey)}>
                                    <Iconify icon="solar:pen-bold" />
                                    Edit
                                </MenuItem>
                            ))}
                    <MenuItem
                        onClick={(issue) => {
                            handleDeleteClick(issue.id);
                            popover.onClose(); 
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure you want to delete this issue?
                        <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
                            <strong> NOTE: </strong> All tasks related to this issue will also be
                            deleted.
                        </Box>
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            // Call the onConfirm function stored in the dialog state
                            confirmDialog.onConfirm(); // This will perform the deletion
                            confirmDialog.onFalse(); // Close the dialog
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}

SprintIssuesList.propTypes = {
    items: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    openSprint: PropTypes.bool,
    handleCheckBoxChange: PropTypes.func,
    setIssues: PropTypes.func,
};
