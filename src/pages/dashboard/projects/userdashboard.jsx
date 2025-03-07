import React, { useState, useEffect } from 'react';

import {
    Box,
    Card,
    Table,
    Paper,
    Stack,
    Avatar,
    Toolbar,
    Skeleton,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    Typography,
    TableContainer,
    TableSortLabel,
    InputAdornment,
    TablePagination,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import OverrunModal from 'src/sections/employees/completed-overrun-modal';

function HomeUserView() {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedOverrunType, setSelectedOverrunType] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredReport = report.filter((row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedFilteredReport = filteredReport.slice().sort((a, b) => {
        if (orderBy) {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        }
        return 0;
    });

    const columns = [
        { key: 'name', label: 'Employee name', icon: 'solar:user-outline', sortable: true },
        {
            key: 'total_projects',
            label: 'Total Projects',
            icon: 'hugeicons:task-done-02',
            sortable: true,
        },
        { key: 'total_tasks', label: 'Total Tasks', icon: 'bi:list-task', sortable: true },
        {
            key: 'completed_tasks',
            label: 'Completed Tasks',
            icon: 'hugeicons:task-done-02',
            sortable: true,
        },
        {
            key: 'inprogress_tasks',
            label: 'In-Progress Tasks',
            icon: 'qlementine-icons:task-soon-16',
            sortable: true,
        },
        {
            key: 'pending_tasks',
            label: 'Pending Tasks\n(To-Do tasks)',
            icon: 'qlementine-icons:task-past-16',
            sortable: true,
        },
        {
            key: 'completed_overrun',
            label: 'Completed Overrun',
            icon: 'fluent-mdl2:recurring-task',
            sortable: true,
        },
        {
            key: 'inprogress_overrun',
            label: 'In-Progress Overrun',
            icon: 'carbon:task-asset-view',
            sortable: true,
        },
    ];

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(endpoints.project.project_employee_report);
                setReport(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(true);
            }
        };

        fetchReport();
    }, []);

    const handleRequestSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedReport = report.slice().sort((a, b) => {
        if (orderBy) {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        }
        return 0;
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleOpenModal = (employeeId, overrunType) => {
        setSelectedEmployeeId(employeeId);
        setSelectedOverrunType(overrunType);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployeeId(null);
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Card
            component={Paper}
            sx={{ borderRadius: 2, overflowX: 'auto', margin: { xs: 1, sm: 2, md: 4 } }}
        >
            <TableContainer>
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: { xs: 1, sm: 2 },
                    }}
                >
                    <Typography variant="h6" sx={{ whiteSpace: 'nowrap', mr: 2 }}>
                        Project Employee Summary
                    </Typography>

                    <Box sx={{ flexGrow: 1, maxWidth: 1000 }}>
                        {' '}
                        <TextField
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Employee..."
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
                        />
                    </Box>
                </Toolbar>

                {loading ? (
                    <Stack spacing={2} sx={{ padding: 2 }}>
                        <Skeleton variant="rectangular" height={40} />
                        <Skeleton variant="rectangular" height={40} />
                        <Skeleton variant="rectangular" height={40} />
                    </Stack>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        sx={{
                                            minWidth: 120,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === col.key}
                                                direction={orderBy === col.key ? order : 'asc'}
                                                onClick={() => handleRequestSort(col.key)}
                                            >
                                                <span
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Iconify
                                                        icon={col.icon}
                                                        width={20}
                                                        sx={{ color: 'grey.500' }}
                                                    />
                                                    <Typography variant="body2">
                                                        {col.label}
                                                    </Typography>
                                                </span>
                                            </TableSortLabel>
                                        ) : (
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                <Iconify
                                                    icon={col.icon}
                                                    width={20}
                                                    sx={{ color: 'grey.500' }}
                                                />
                                                <Typography variant="body2">{col.label}</Typography>
                                            </span>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedFilteredReport.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <EmptyContent
                                            sx={{ py: 10 }}
                                            title="No employee task data found."
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedFilteredReport
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                            <TableRow key={row.employee_id}>
                                                {columns.map((col) => (
                                                    <TableCell
                                                        key={col.key}
                                                        align="center"
                                                        size="small"
                                                        sx={{
                                                            borderRight:
                                                                col.key !== 'pending_tasks'
                                                                    ? '1px dashed rgba(0, 0, 0, 0.1)'
                                                                    : '',
                                                            minWidth: 120,
                                                            verticalAlign: 'middle',
                                                        }}
                                                    >
                                                        {col.key === 'name' ? (
                                                            <Stack
                                                                direction="row"
                                                                spacing={2}
                                                                alignItems="center"
                                                                sx={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                }}
                                                            >
                                                                <Avatar
                                                                    alt={row.name || 'User'}
                                                                    src={row.avatar}
                                                                    sx={{
                                                                        width: 32,
                                                                        height: 32,
                                                                        borderRadius: '50%',
                                                                        bgcolor: row.avatar,
                                                                        color: 'white',
                                                                        fontSize: 20,
                                                                    }}
                                                                >
                                                                    {!row.avatar && row.name
                                                                        ? row.name
                                                                              .charAt(0)
                                                                              .toUpperCase()
                                                                        : 'A'}
                                                                </Avatar>
                                                                <Stack
                                                                    direction="column"
                                                                    spacing={0.5}
                                                                    sx={{
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        fontWeight="bold"
                                                                        color="text.primary"
                                                                        align="left"
                                                                    >
                                                                        {row.name}
                                                                    </Typography>
                                                                </Stack>
                                                            </Stack>
                                                        ) : col.key === 'completed_overrun' ||
                                                          col.key === 'inprogress_overrun' || 
                                                          col.key === 'pending_tasks' ? (
                                                            row[col.key] !== 0 ? (
                                                                <Box
                                                                    sx={{
                                                                        display: 'inline-block',
                                                                        px: 1.5,
                                                                        py: 0.5,
                                                                        borderRadius: 1,
                                                                        fontWeight: 'bold',
                                                                        color: 'error.main',
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline',
                                                                        '&:hover': {
                                                                            color: 'error.dark',
                                                                        },
                                                                    }}
                                                                    onClick={() =>
                                                                        handleOpenModal(
                                                                            row.employee_id,
                                                                            col.key
                                                                        )
                                                                    }
                                                                >
                                                                    {row[col.key]}
                                                                </Box>
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        display: 'inline-block',
                                                                        px: 1.5,
                                                                        py: 0.5,
                                                                        borderRadius: 1,
                                                                        fontWeight: 'bold',
                                                                        color: 'inherit',
                                                                    }}
                                                                >
                                                                    {row[col.key]}
                                                                </Box>
                                                            )
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-block',
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    fontWeight: 'bold',
                                                                    color: (theme) =>
                                                                        row[col.key] === 0
                                                                            ? 'inherit'
                                                                            : theme.palette.text
                                                                                  .primary,
                                                                }}
                                                            >
                                                                {row[col.key]}
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <OverrunModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                assigneeId={selectedEmployeeId}
                overrunType={selectedOverrunType}
            />
            {!loading && report.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={report.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Card>
    );
}

export default HomeUserView;
