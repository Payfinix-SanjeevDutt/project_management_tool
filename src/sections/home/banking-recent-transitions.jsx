import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function BankingRecentTransitions({ title, subheader, tableData, headLabel, ...other }) {
    console.log('tableData>>', tableData);

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

            <Scrollbar sx={{ minHeight: 462 }}>
                <Table sx={{ minWidth: 720 }}>
                    <TableHeadCustom headLabel={headLabel} />

                    <TableBody>
                        {tableData.map((row) => (
                            <RowItem key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 2, textAlign: 'right' }}>
                <Button
                    size="small"
                    color="inherit"
                    endIcon={
                        <Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />
                    }
                >
                    View all
                </Button>
            </Box>
        </Card>
    );
}

// ----------------------------------------------------------------------

function RowItem({ row }) {
    const theme = useTheme();

    const popover = usePopover();

    const lightMode = theme.palette.mode === 'light';

    const handleDownload = () => {
        popover.onClose();
        console.info('DOWNLOAD', row.id);
    };

    const handlePrint = () => {
        popover.onClose();
        console.info('PRINT', row.id);
    };

    const handleShare = () => {
        popover.onClose();
        console.info('SHARE', row.id);
    };

    const handleDelete = () => {
        popover.onClose();
        console.info('DELETE', row.id);
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            variant="rounded"
                            alt={row.name}
                            src={row.avatarUrl}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {row.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {row.category}
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>{row.date}</TableCell>

                <TableCell>
                    <Label
                        variant={lightMode ? 'soft' : 'filled'}
                        color={
                            (row.status === 'Paid' && 'success') ||
                            (row.status === 'Pending' && 'error') ||
                            'error'
                        }
                    >
                        {row.status}
                    </Label>
                </TableCell>
            </TableRow>

            {/* <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleDownload}>
            <Iconify icon="eva:cloud-download-fill" />
            Download
          </MenuItem>

          <MenuItem onClick={handlePrint}>
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem onClick={handleShare}>
            <Iconify icon="solar:share-bold" />
            Share
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover> */}
        </>
    );
}
