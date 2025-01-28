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
    { id: 'type', label: 'Type', align: 'center', icon: '', hide: false, width: 100 },
    // { id: 'key', label: 'Key', align: 'center', icon: 'ph:hash-bold', hide: false, width: 200 },
    {
        id: 'description',
        label: 'Summary',
        align: 'left',
        icon: 'fluent:text-description-32-filled',
        hide: false,
        width: 300,
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
        id: 'sprint_id',
        label: 'Sprint',
        align: 'center',
        icon: 'fluent:arrow-sprint-20-filled',
        hide: false,
        width: 150,
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
        id: 'actual_start_date',
        label: 'Actual Start date',
        align: 'center',
        icon: 'solar:calendar-date-bold',
        hide: false,
        width: 200,
    },
    {
        id: 'actual_end_date',
        label: 'Actual end date',
        align: 'center',
        icon: 'solar:calendar-date-bold',
        hide: false,
        width: 200,
    },
    {
        id: 'parent_id',
        label: 'Parent',
        align: 'center',
        icon: 'gg:git-pull',
        hide: false,
        width: 230,
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
                        sx={{ width: headCell.width, minWidth: headCell.width }}
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
