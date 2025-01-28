import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------
export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const confirm = useBoolean();

    const popover = usePopover();

    return (
        <>
       
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <Avatar alt={row.name} src={row.avatarUrl} />

                        <Stack
                            sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}
                        >
                            <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                                {row.name}
                            </Link>
                            {/* <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box> */}
                        </Stack>
                    </Stack>
                </TableCell>
                                    
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.email}</TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.mobile || '---'}</TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.status === 'active' && 'success') ||
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'complete' && 'error') ||
                            'default'
                        }
                    >
                        {row.verification || '----'}
                    </Label>
                </TableCell>

                <TableCell sx={{ alignItems: 'right' }}>
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
                        <Iconify icon="cib:open-access" />
                        suspend access
                    </MenuItem>

                    <MenuItem onClick={() => {}}>
                        <Iconify icon="charm:circle-tick" />
                        grant access
                    </MenuItem>

                    <MenuItem onClick={() => {}}>
                        <Iconify icon="mdi:email-resend" />
                        resend invite
                    </MenuItem>

                    <MenuItem onClick={() => {}}>
                        <Iconify icon="lets-icons:view-fill" />
                        view details
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            onEditRow();
                            popover.onClose();
                        }}
                    >
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
                    <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                        onDeleteRow(); 
                        confirm.onFalse(); 
                    }}
                >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
