import { Chip, Button, MenuItem, MenuList, TableRow, TableCell, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export default function ChildIssuesRow({ issue }) {
    const { id, title, status1 } = issue;
    const confirm = useBoolean();
    const popover = usePopover();

    return (
        <>
            <TableRow>
                <TableCell sx={{ p: 0 }} align="left">
                    <Button
                        href={`#${id}`} // Or any link to navigate
                        variant="text"
                        sx={{ textTransform: 'none' }}
                    >
                        {id}
                    </Button>
                </TableCell>

                <TableCell sx={{ p: 0 }} align="center">
                    {title}
                </TableCell>

                {/* <TableCell sx={{ p: 0 }} align='center'>{status1}</TableCell> */}
                <TableCell sx={{ p: 0 }} align="center">
                    <Chip
                        label={status1}
                        sx={{
                            bgcolor: (() => {
                                switch (status1) {
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
                    />
                </TableCell>

                <TableCell sx={{ p: 0 }} align="right">
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

                    <MenuItem onClick={() => {}}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => {}}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
