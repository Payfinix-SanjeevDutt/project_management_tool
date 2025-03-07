import React, { useState, useEffect } from 'react';

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

import { useParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

function DashboardStageView() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { project_id } = useParams();
    console.log("project_id>>", project_id);
    

    const columns = [
        { key: 'stage_name', label: 'Stages', icon: 'solar:user-outline', sortable: true },
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
            label: (
                <div style={{ whiteSpace: 'nowrap' }}>
                    Pending Tasks <br />
                    (To-Do tasks)
                </div>
            ),
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
            key: 'num_unique_employees',
            label: 'Total Employees',
            icon: 'bi:list-task',
            sortable: true,
        },
    ];

    useEffect(() => {
        if (!project_id) return;

        setLoading(true);
        setError(null);

        axiosInstance
            .post(endpoints.stages.stageEmployeeReport, { project_id })
            .then((response) => {
                setReportData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch data');
                setLoading(false);
            });
    }, [project_id]);

    const handleRequestSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedReport = [...reportData].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (typeof aValue === 'string')
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        return order === 'asc' ? aValue - bValue : bValue - aValue;
    });

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                    <Typography variant="subtitle1">Stages Report</Typography>
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
                                        sx={{ minWidth: 100, textAlign: 'center' }}
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
                                                        gap: '6px',
                                                    }}
                                                >
                                                <Iconify
                                                    icon={col.icon}
                                                    width={20}
                                                    sx={{ color: 'grey.500' }}
                                                />
                                                {col.label}
                                                </span>
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
                                            title="No stage data found."
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
                                                        col.key === 'stage_name' ? 'left' : 'center'
                                                    }
                                                    sx={{
                                                        minWidth: 120,
                                                        textAlign:
                                                            col.key === 'stage_name'
                                                                ? 'left'
                                                                : 'center',
                                                        verticalAlign: 'middle',
                                                        padding: '4px 8px',
                                                    }}
                                                >
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
                                                                    : col.key.includes(
                                                                            'completed_overrun'
                                                                        ) ||
                                                                        col.key.includes(
                                                                            'inprogress_overrun'
                                                                        )|| col.key.includes(
                                                                            'pending_tasks'
                                                                        )
                                                                      ? theme.palette.error.main
                                                                      : theme.palette.text.primary,
                                                        }}
                                                    >
                                                        {row[col.key]}
                                                    </Box>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

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

export default DashboardStageView;
