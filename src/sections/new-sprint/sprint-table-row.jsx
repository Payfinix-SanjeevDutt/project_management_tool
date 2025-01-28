import dayjs from 'dayjs';
import { useState } from 'react';

import {
    Box,
    Stack,
    Modal,
    Avatar,
    Divider,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    TextField,
    Typography,
    IconButton,
    ClickAwayListener,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import SprintEdit from './sprint-issues-details';

const STATUS_TYPE = {
    TODO: { label: 'To Do', color: 'default' },
    IN_PROGRESS: { label: 'In Progress', color: 'info' },
    DONE: { label: 'Done', color: 'success' },
};


const PRIORITY_TYPE = {
    HIGH: { label: 'High', color: 'error' },
    CRITICAL: { label: 'Critical', color: 'error' },
    MEDIUM: { label: 'Medium', color: 'warning' },
    LOW: { label: 'Low', color: 'info' },
};

const SPRINTS = [];

const EMPLOYEES = [
    {
        id: 1,
        name: 'Smith',
        avatar: '',
    },
    {
        id: 2,
        name: 'Jone',
        avatar: '',
    },
    {
        id: 3,
        name: 'Amith',
        avatar: '',
    },
    {
        id: 4,
        name: 'Unassigned',
        avatar: '',
    },
];

export default function SprintTableRow({
    tasks,
    setSubTasks,
    setTasks,
    subTasks = {},
    isChild = false,
    parent = '',
    task,
}) {
    console.log('props>>>', task);

    const open = useBoolean();
    const isCreatingTask = useBoolean();
    const [tempName, setTempName] = useState('');
    const [tempRowEdit, setRowEdit] = useState({ ...tasks });
    const [selectedIssues, setSelectedIssues] = useState(null);
    const [popover, setPopover] = useState({
        open: false,
        anchorEl: null,
    });
    const [openModal, setOpenModal] = useState(false);

    const handlePopoverOpen = (event) => {
        setPopover({ open: true, anchorEl: event.currentTarget });
    };

    const handlePopoverClose = () => {
        setPopover({ open: false, anchorEl: null });
    };
    // const popover = usePopover();
    const confirm = useBoolean();
    console.log('tempRowEdit>>', tempRowEdit);

    const handleSummaryEdit = (event) => {
        setRowEdit((prev) => ({
            ...prev,
            summary: event.target.value,
        }));
    };

    const handleRowEdit = (name, newValue) => {
        console.log(newValue);
        setRowEdit((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleFieldEvent = () => {
        isCreatingTask.onTrue();
        open.onTrue();
    };

    const handleTempName = (event) => {
        setTempName(event.target.value);
    };

    const handleEditClick = (valueKey) => {
        setPopover({ ...popover, open: false });
        setOpenModal(true);
        const { name: issueName, status, assign } = tempRowEdit[valueKey];
        const assignedEmployee = EMPLOYEES.filter((it) => it.id === assign)[0];
        const assignedEmployeeName = assignedEmployee ? assignedEmployee.name : null;
        setSelectedIssues([{ issueName, status, assignedEmployeeName }]);
        // setSelectedItem(valueKey);
    };
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleKeyUpEvent = async (event) => {
        if (event.key === 'Enter') {
            const subTaskId = Math.random().toString(36).substring(2, 6);
            const newSubTask = {
                id: subTaskId,
                type: 'subtask',
                summary: tempName,
                status: 'inprogress',
                sprint: '',
                start_date: dayjs(),
                end_date: dayjs().add(1, 'month'),
                labels: ['DEVELOPMENT'],
                priority: 'medium',
                assignee: 1,
                reporter: 2,
            };

            setSubTasks((prev) => ({ ...prev, [subTaskId]: newSubTask }));
            setTasks((prev) => ({
                ...prev,
                [tempRowEdit.id]: {
                    ...prev[tempRowEdit.id],
                    childern: [...prev[tempRowEdit.id].childern, subTaskId],
                },
            }));
            setTempName('');
            isCreatingTask.onFalse();
        }
    };

    const handleCancel = () => {
        isCreatingTask.onFalse();
        open.onFalse();
    };

    return (
        <>
            <TableRow
                key={task.task_id}
                sx={{
                    '&:last-child td, &:last-child th': {
                        borderRight: '1px dashed rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <TableCell
                    component="th"
                    scope="row"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <Checkbox />
                </TableCell>
                <TableCell
                    align="left"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        name="summary"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    border: 'none',
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: '2px solid black',
                                },
                            },
                            width: 300,
                        }}
                        value={task.task_name}
                    />
                </TableCell>

                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <Label color={STATUS_TYPE[task.status].color}>
                        {STATUS_TYPE[task.status].label}
                    </Label>
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200 }}
                >
                    {task.assignee_id ? (
                        <Stack component="li" gap={1} direction="row">
                            <Avatar  sx={{ width: 24, height: 24 }} alt="sbhd" src={task.assignee_id} />

                            {/* <Stack component="li" gap={1} direction="column"> */}
                                <Typography>{task.assignee_name}</Typography>
                                {/* <Typography>{task.assignee_email}</Typography> */}
                            {/* </Stack> */}
                        </Stack>
                    ) : (
                        <Label>Un-Assigned</Label>
                    )}
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200, align:"center" }}
                >
                    {task.assignee_id ? (
                        <Stack component="li" gap={1} direction="row">
                            <Avatar  sx={{ width: 24, height: 24 }} alt="sbhd" src={task.assignee_id} />

                            {/* <Stack component="li" gap={1} direction="column"> */}
                                <Typography>{task.assignee_name}</Typography>
                                {/* <Typography>{task.assignee_email}</Typography> */}
                            {/* </Stack> */}
                        </Stack>
                    ) : (
                        <Label>Un-Assigned</Label>
                    )}
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200 }}
                >
                    <Typography variant="overline">{fDate(task.start_date)}</Typography>
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200 }}
                >
                    <Typography variant="overline">{fDate(task.end_date)}</Typography>
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    borderRight="1px dashed grey"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <Label color={PRIORITY_TYPE[task.priority].color}>
                        {PRIORITY_TYPE[task.priority].label}
                    </Label>
                </TableCell>

                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <IconButton
                        color={popover.open ? 'inherit' : 'default'}
                        onClick={handlePopoverOpen}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>

                {/* </Box> */}
            </TableRow>

            {isCreatingTask.value && (
                <TableRow>
                    <TableCell colSpan={12} sx={{ pl: 25 }}>
                        <ClickAwayListener onClickAway={handleCancel}>
                            <TextField
                                autoFocus
                                placeholder="Enter task details"
                                variant="outlined"
                                fullWidth
                                value={tempName}
                                onChange={handleTempName}
                                onKeyUp={handleKeyUpEvent}
                            />
                        </ClickAwayListener>
                    </TableCell>
                </TableRow>
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
                        // items={items}
                        handleModalClose={handleModalClose}
                    />
                </Box>
            </Modal>

            <CustomPopover
                open={popover.open} // Controlled open state
                onClose={handlePopoverClose} // Close popover
                anchorEl={popover.anchorEl} // Pass anchor element
                arrow="right-top"
                sx={{ width: 160 }}
            >
                {/*  <MenuItem
                    onClick={() => {
                        // onEditRow();
                        // popover.onClose();
                        handlePopoverClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem> */}

                {/* {issues[items] && */}
                {/* Object.keys(issues[items]) */}
                {/* .slice(0, 1) // Limit to the first item */}
                {/* .map((valueKey) => ( */}
                {/* <MenuItem key={valueKey} onClick={() => handleEditClick(valueKey)}> */}
                <MenuItem onClick={() => handleEditClick()}>
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>
                {/* ))} */}

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={() => {
                        confirm.onTrue();
                        handlePopoverClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            {open.value &&
                tasks.childern.map((child) => (
                    <SprintTableRow
                        key={child}
                        tasks={subTasks[child]}
                        isChild
                        setSubTasks={setSubTasks}
                        setTasks={setTasks}
                        parent={tempRowEdit.id}
                    />
                ))}
        </>
    );
}
