import { useDispatch } from 'react-redux';

import { MenuItem, MenuList, TableRow, TableCell, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import useTasks from './hooks/useTasks';

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

export default function ChildIssuesRow({ issue ,issueKey}) {
    const { task_id, task_name, priority, status } = issue;
    const confirm = useBoolean();
    const popover = usePopover();
    const { deleteSubTask } = useTasks();
    const dispatch = useDispatch();
    
    
    const handleDeleteConfirm = async() => {
        await deleteSubTask(task_id, issueKey);
    };

    return (
        <>
            <TableRow>
                {/* <TableCell sx={{ p: 0 }} align="left">
                       <Typography variant='subtitle2'> {task_id}</Typography>
                </TableCell> */}

                <TableCell sx={{ p: 0 }} align="center">
                    {task_name}
                </TableCell>
                <TableCell sx={{ p: 0 }} align="center">
                    <Label color={STATUS_TYPE[status].color}>{STATUS_TYPE[status].label}</Label>
                </TableCell>
                <TableCell sx={{ p: 0 }} align="center">
                    <Label color={PRIORITY_TYPE[priority].color}>
                        {PRIORITY_TYPE[priority].label}
                    </Label>
                </TableCell>
                <TableCell sx={{ p: 0 }} align="right">
                    <IconButton
                        color={popover.open ? 'inherit' : 'default'}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
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
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    // <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                    //     Delete
                    // </Button>
                    null
                }
            />
        </>
    );
}
