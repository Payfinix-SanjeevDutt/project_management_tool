import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import {
    Stack,
    Avatar,
    Button,
    Dialog,
    Checkbox,
    TableRow,
    MenuItem,
    MenuList,
    Skeleton,
    TableCell,
    Typography,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import useTasks from './hooks/useTasks';
import CreateTask from './createtask_modal';
import TaskModelView from './task_model_view';

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

export default function CustomTableRow({ task, isChild = false, selected, onSelectRow, loading }) {
    const { employees } = useSelector((state) => state.assignee);
    const { subTasks, deleteTask, deleteSubTask } = useTasks();
    const popover = usePopover();
    const dispatch = useDispatch();
    const modalOpen = useBoolean();
    const createSubtask = useBoolean();
    const dropDown = useBoolean();
    const [openDialog, setOpenDialog] = useState(false);

    const reporter_info = employees[task.reporter_id];
    const assignee_info = employees[task.assignee_id];
    const { project_id, id, taskid } = useParams();
    const navigate = useNavigate();
 
    const isCurrentTaskModalOpen = modalOpen.value || task.task_id === taskid;

    if (loading) {
        return (
            <TableRow>
                <TableCell colSpan={12}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="rectangular" height={20} width="10%" />
                        <Skeleton variant="rectangular" height={20} width="10%" />
                    </Stack>
                </TableCell>
            </TableRow>
        );
    }
    if (!task) {
        return null;
    }

    const handleDeleteConfirm = () => {
        setOpenDialog(false);

        dispatch(isChild ? deleteSubTask(task.task_id, task.parent_id) : deleteTask(task.task_id));

        popover.onClose();
    };

    const handleDeleteCancel = () => {
        setOpenDialog(false);
    };

    const handleDeleteClick = () => {
        popover.onClose();
        setOpenDialog(true);    
    };

    return (
        <>
            <TableRow key={task.task_id} hover selected={selected} tabIndex={-1}>
                <TableCell
                    scope="row"
                    size="small"
                    align="center"
                    padding="checkbox"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    {!isChild && (<Checkbox checked={selected} onClick={onSelectRow} />)}
                    
                </TableCell>
                <TableCell
                    alignItems="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    {!isChild && (
                        <Stack gap={0.5} direction="row" sx={{ alignItems: 'center' }}>
                            <IconButton
                                className="icon-button"
                                variant="contained"
                                onClick={createSubtask.onTrue}
                            >
                                <Iconify icon="mingcute:add-circle-line" />
                            </IconButton>
                            {(task?.children || []).length > 0 && (
                                <IconButton onClick={dropDown.onToggle}>
                                    <Iconify
                                        icon={
                                            dropDown.value
                                                ? 'mingcute:down-line'
                                                : 'mingcute:right-line'
                                        }
                                    />
                                </IconButton>
                            )}

                            <CreateTask
                                open={createSubtask.value}
                                onClose={createSubtask.onFalse}
                                parent_id={task.task_id}
                                taskname={task.task_name}
                            />
                        </Stack>
                    )}
                </TableCell>
                <TableCell
                    align="left"
                    size="small"
                    sx={{
                        borderRight: '1px dashed rgba(0, 0, 0, 0.1)',
                        minWidth: 300,
                        cursor: 'pointer', 
                        '&:hover': {
                            textDecoration: 'underline',
                            bgcolor: 'rgba(0, 0, 0, 0.05)', 
                        },
                    }}
                    // onClick={modalOpen.onTrue}
                    onClick={() =>
                        navigate(paths.dashboard.stages.taskview(project_id, id, task.task_id))
                    }
                >
                    <Typography variant="body2">{task.task_name}</Typography>
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
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200 }}
                >
                    <Typography variant="overline">
                        {fDate(task.actual_start_date) || <Label>Un-Defined</Label>}
                    </Typography>
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)', minWidth: 200 }}
                >
                    <Typography variant="overline">
                        {fDate(task.actual_end_date) || <Label>Un-Defined</Label>}
                    </Typography>
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
                    <Typography
                        variant={task.sprint_id && 'overline'}
                        sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {task.sprint_id || <Label>Un-Defined</Label>}
                    </Typography>
                </TableCell>
                <TableCell
                    align="center"
                    size="small"
                    sx={{ borderRight: '1px dashed rgba(0, 0, 0, 0.1)' }}
                >
                    <Typography variant="overline" sx={{ textDecoration: 'underline' }}>
                        {task.parent_id}
                    </Typography>
                </TableCell>

                <TableCell
                    align="center"
                    size="small"
                    sx={{
                        borderRight: '1px dashed rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        verticalAlign: 'middle',
                    }}
                >
                    {task.reporter_id ? (
                        <Stack
                            component="li"
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                        >
                            <Avatar
                                alt={reporter_info.name || 'Reporter Avatar'}
                                src={reporter_info.avatar}
                                sx={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                            <Stack
                                direction="column"
                                sx={{ width: '100%', justifyContent: 'center' }}
                            >
                                <Typography variant="body2" fontWeight="bold" color="text.primary">
                                    {reporter_info.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {reporter_info.email}
                                </Typography>
                            </Stack>
                        </Stack>
                    ) : (
                        <Label>Un-Assigned</Label>
                    )}
                </TableCell>

                <TableCell
                    align="center"
                    size="small"
                    sx={{
                        borderRight: '1px dashed rgba(0, 0, 0, 0.1)',
                        minWidth: 200,
                        verticalAlign: 'middle',
                    }}
                >
                    {task.assignee_id ? (
                        <Stack
                            component="li"
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
                        >
                            <Avatar
                                alt={assignee_info.name}
                                src={assignee_info.avatar}
                                sx={{ width: 32, height: 32, borderRadius: '50%' }}
                            />

                            <Stack
                                direction="column"
                                sx={{ width: '100%', justifyContent: 'center' }}
                            >
                                <Typography variant="body2" fontWeight="bold" color="text.primary">
                                    {assignee_info.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {assignee_info.email}
                                </Typography>
                            </Stack>
                        </Stack>
                    ) : (
                        <Label>Un-Assigned</Label>
                    )}
                </TableCell>
                

                <TableCell align="center" size="small">
                    <IconButton
                        color={popover.open ? 'inherit' : 'default'}
                        onClick={popover.onOpen}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
            >
                <MenuList>
                    <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            modalOpen.onTrue();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>
                </MenuList>
            </CustomPopover>
            <Dialog
                open={openDialog}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-confirmation-dialog"
            >
                <DialogTitle id="delete-confirmation-dialog">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this task?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {dropDown.value &&
                (task?.children || []).map((child) => (
                    <CustomTableRow task={subTasks[child]} isChild />
                ))}

            {/* <TaskModelView
                open={modalOpen.value}
                onClose={modalOpen.onFalse}
                issueKey={task.task_id}
                isChild={!!task.parent_id}
                taskname={task.task_name}
            /> */}
             <TaskModelView
                open={isCurrentTaskModalOpen}
                onClose={() => {
                    modalOpen.onFalse();
                    navigate(paths.dashboard.stages.task(project_id,id)); // or your base URL
                }}
                issueKey={task.task_id}
                isChild={!!task.parent_id}
                taskname={task.task_name}
            />
        </>
    );
}
