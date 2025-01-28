import * as React from 'react';
import PropTypes from 'prop-types';

import { visuallyHidden } from '@mui/utils';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Box, Stack, Checkbox, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const HEADERS = [
    {
        id: 'task',
        label: 'Tasks',
        align: 'left',
        icon: 'fluent:text-description-32-filled',
        hide: false,
        width: 500,
    },
    {
        id: 'status',
        label: 'Status',
        align: 'left',
        icon: 'lets-icons:status',
        hide: false,
        width: 100,
    },
    {
        id: 'reporter_id',
        label: 'Creator',
        align: 'center',
        icon: 'heroicons:at-symbol-20-solid',
        hide: false,
        width: 200,
    },
    {
        id: 'assignee_id',
        label: 'Assignee',
        align: 'center',
        icon: 'heroicons:at-symbol-20-solid',
        hide: false,
        width: 200,
    },
    {
        id: 'start_date',
        label: 'Start date',
        align: 'center',
        icon: 'solar:calendar-date-bold',
        hide: false,
        width: 200,
    },
    {
        id: 'end_date',
        label: 'End date',
        align: 'center',
        icon: 'solar:calendar-date-bold',
        hide: false,
        width: 200,
    },
    {
        id: 'priority',
        label: 'Priority',
        align: 'left',
        icon: 'iconoir:priority-down-solid',
        hide: false,
        width: 100,
    },
    {
        id: 'action',
        label: 'Action',
        align: 'left',
        icon: 'iconoir:priority-down-solid',
        hide: false,
        width: 100,
    },
    {
        width: 100,
        hide: false,
    },
];

export default function EnhancedTableHead({
    order,
    orderBy,
    onRequestSort,
    rowCount = 0,
    numSelected = 0,
    onSelectAllRows,
}) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        align="center"
                        inputProps={{
                            'aria-label': 'select all tasks',
                        }}
                    />
                </TableCell>
                {onSelectAllRows && (
                    <TableCell padding="checkbox" align="left">
                        <Checkbox
                            indeterminate={!!numSelected && numSelected < rowCount}
                            checked={!!rowCount && numSelected === rowCount}
                            onChange={(event) => onSelectAllRows(event.target.checked)}
                            inputProps={{
                                name: 'select-all-rows',
                                'aria-label': 'select all rows',
                            }}
                        />
                    </TableCell>
                )}
                {HEADERS.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ width: headCell.width }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <Stack gap={1} direction="row">
                                {headCell.icon && <Iconify icon={headCell.icon} />}
                                <Typography variant="body2">{headCell.label}</Typography>
                            </Stack>
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};
