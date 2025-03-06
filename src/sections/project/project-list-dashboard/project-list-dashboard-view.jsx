import React, { useMemo, useState, useEffect } from 'react';

import {
    Box,
    Card,
    Table,
    Paper,
    Alert,
    Toolbar,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
    TableSortLabel,
    TablePagination,
    CircularProgress,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import ListProjectOverrunModal from '../list-completed-overrun-modal';

function ProjectListDashboardView() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const { project_id } = useParams();
    const project_id = useMemo(() => ['EIKEGIJKGMGGGKK9538330'], []);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOverrunType, setSelectedOverrunType] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    console.log('reportData>', reportData);
    console.log('project_id>', project_id);

    const columns = [
        { key: 'project_name', label: 'Projects', icon: 'solar:user-outline', sortable: true },
        { key: 'total_stages', label: 'Total Stages', icon: 'bi:list-task', sortable: true },
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
            key: 'delayed_tasks',
            label: 'Delayed Tasks',
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
        {
            key: 'number_employees',
            label: 'Total Employees',
            icon: 'bi:list-task',
            sortable: true,
        },
    ];

    useEffect(() => {

        setLoading(true);
        setError(null);

        axiosInstance
            .get(endpoints.project.project_stage_report)
            .then((response) => {
                setReportData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch data');
                setLoading(false);
            });
    }, []);

    const handleRequestSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const sortedReport =
        Array.isArray(reportData.projects) && reportData.projects.length > 0
            ? [...reportData.projects].sort((a, b) => {
                  const aValue = a[orderBy] ?? '';
                  const bValue = b[orderBy] ?? '';

                  if (typeof aValue === 'string') {
                      return order === 'asc'
                          ? aValue.localeCompare(bValue)
                          : bValue.localeCompare(aValue);
                  }
                  return order === 'asc'
                      ? (aValue || 0) - (bValue || 0)
                      : (bValue || 0) - (aValue || 0);
              })
            : [];

    console.log('sortedReport>>', sortedReport);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (employeeId, overrunType) => {
        setSelectedEmployeeId(employeeId);
        setSelectedOverrunType(overrunType);
        setOpenModal(true);
    };

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
                        padding: { xs: 1, sm: 2 },
                    }}
                >
                    <Typography variant="subtitle1">Project List Dashboard</Typography>
                </Toolbar>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ py: 2, px: 3 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.key}
                                        sx={{ minWidth: 160, textAlign: 'center' }}
                                    >
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={orderBy === col.key}
                                                direction={orderBy === col.key ? order : 'asc'}
                                                onClick={() => handleRequestSort(col.key)}
                                            >
                                                <Iconify
                                                    icon={col.icon}
                                                    width={20}
                                                    sx={{ color: 'grey.500' }}
                                                />
                                                {col.label}
                                            </TableSortLabel>
                                        ) : (
                                            <span>
                                                <Iconify
                                                    icon={col.icon}
                                                    width={20}
                                                    sx={{ color: 'grey.500' }}
                                                />
                                                {col.label}
                                            </span>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedReport.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <EmptyContent
                                            title="No project data found."
                                            sx={{ py: 10 }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedReport
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index} sx={{ height: '20px' }}>
                                            {columns.map((col) => (
                                                <TableCell
                                                    key={col.key}
                                                    align={
                                                        col.key === 'project_name'
                                                            ? 'left'
                                                            : 'center'
                                                    }
                                                    sx={{
                                                        minWidth: 120,
                                                        textAlign:
                                                            col.key === 'project_name'
                                                                ? 'left'
                                                                : 'center',
                                                        verticalAlign: 'middle',
                                                        padding: '4px 8px',
                                                    }}
                                                >
                                                    {col.key.includes('completed_overrun') ||
                                                    col.key.includes('inprogress_overrun') ? (
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
                                                                    color: (theme) =>
                                                                        theme.palette.text.primary,
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
            <ListProjectOverrunModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                assigneeId={selectedEmployeeId}
                overrunType={selectedOverrunType}
            />

            {sortedReport.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedReport.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Card>
    );
}

export default ProjectListDashboardView;
