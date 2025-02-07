import { useDispatch } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import {
    Box,
    Card,
    Stack,
    Modal,
    Button,
    Tooltip,
    TableRow,
    TableCell,
    IconButton,
    Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useTable, emptyRows, TableEmptyRows, TablePaginationCustom } from 'src/components/table';

import { StageDetails } from 'src/sections/stages/stage-details';

import TaskTabs from '../task-tabs';
import useTasks from '../hooks/useTasks';
import CreateTask from '../createtask_modal';
import EnhancedTableHead from '../task-header';
import CustomTableRow from '../task-row-component';
import { TaskTableToolbar } from '../task-toolbar';
import { TableSelectedAction } from '../table-selected-actions';
import { TaskTableFiltersResult } from '../task-table-filter-result';

export default function TaskCreate() {
    const { tasks, order, orderBy, fetchTasks, setFilters, deleteAllTasks } = useTasks();
    const isModalOpen = useBoolean();
    const dispatch = useDispatch();
    const { id: stage_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModaOpen, setIsModalOpen] = useState(false);
    const { project_id } = useParams()
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = () => {
        handleDelete(); 
        handleCloseModal();
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        dispatch(setFilters({ name: 'order', value: isAsc ? 'desc' : 'asc' }));
        dispatch(setFilters({ name: 'orderBy', value: property }));
    };

    const table = useTable({ defaultOrderBy: 'key' });

    const filters = useSetState({
        name: '',
        status: 'all',
        startDate: null,
        endDate: null,
    });

    const handleFilterStatus = useCallback(
        (event, newValue) => {
            table.onResetPage();
            filters.setState({ status: newValue });
        },
        [filters, table]
    );

    const dateError = useMemo(
        () =>
            filters.state.startDate && filters.state.endDate
                ? new Date(filters.state.startDate).getTime() >
                  new Date(filters.state.endDate).getTime()
                : false,
        [filters.state.startDate, filters.state.endDate]
    );

    const canReset = useMemo(
        () =>
            !!filters.state.name ||
            filters.state.status !== 'all' ||
            (!!filters.state.startDate && !!filters.state.endDate),
        [filters.state]
    );

    const dataFiltered = useMemo(() => {
        const { status, startDate, endDate, name } = filters.state;

        let filteredData = {};

        filteredData = Object.entries(tasks).filter(([key, task]) => {
            const taskStartDate = new Date(task.start_date).getTime();
            const taskEndDate = new Date(task.end_date).getTime();
            const nameMatch =
                name === '' ||
                task.task_name.toLowerCase().includes(name.toLowerCase()) ||
                (task.status && task.status.toLowerCase().includes(name.toLowerCase())) ||
                (task.priority && task.priority.toLowerCase().includes(name.toLowerCase())) ||
                (task.reporter_name &&
                    task.reporter_name.toLowerCase().includes(name.toLowerCase())) ||
                (task.assignee_name &&
                    task.assignee_name.toLowerCase().includes(name.toLowerCase())) ||
                (task.task_id && task.task_id.toLowerCase().includes(name.toLowerCase()));
            const statusMatch = status === 'all' || status === task.status;
            const dateMatch =
                (!startDate || taskStartDate >= new Date(startDate).getTime()) &&
                (!endDate || taskEndDate <= new Date(endDate).getTime());

            return nameMatch && statusMatch && dateMatch;
        });

        return filteredData;
    }, [tasks, filters]);

    useEffect(() => {
        setLoading(true);
        fetchTasks(stage_id).finally(() => setLoading(false));
        // eslint-disable-next-line
    }, [stage_id]);

    const mergedTasks = dataFiltered.reduce((acc, [taskKey, taskValue]) => {
        acc[taskKey] = taskValue;
        return acc;
    }, {});

    const handleDelete = () => {
        deleteAllTasks([...table.selected])
            .then((success) => {
                if (success) {
                    table.setSelected([]); // Clear selected rows after deletion
                }
            })
            .catch((error) => {
                console.error('Error occurred while deleting tasks:', error);
            });
    };

    return (
        <DashboardContent>
            <Stack gap={3}>
                <CustomBreadcrumbs
                    heading="Stages"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Stages', href: paths.dashboard.stages.create },
                        { name: 'Tasks' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-fill" />}
                            onClick={isModalOpen.onTrue}
                        >
                            New Task
                        </Button>
                    }
                />

                <CreateTask open={isModalOpen.value} onClose={isModalOpen.onFalse} />

                <StageDetails />

                <Card>
                    <TaskTabs handleFilterStatus={handleFilterStatus} filters={filters} />
                    <TaskTableToolbar
                        filters={filters}
                        onResetPage={table.onResetPage}
                        dateError={dateError}
                    />
                    {canReset && (
                        <TaskTableFiltersResult
                            filters={filters}
                            totalResults={dataFiltered.length}
                            onResetPage={table.onResetPage}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                        <Box sx={{ position: 'relative' }}>
                            <TableSelectedAction
                                dense={table.dense}
                                numSelected={table.selected.length}
                                rowCount={dataFiltered.length}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        dataFiltered.map(([taskKey]) => taskKey)
                                    )
                                }
                                action={
                                    <>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={handleOpenModal}>
                                                <Iconify icon="solar:trash-bin-trash-bold" />
                                            </IconButton>
                                        </Tooltip>
                                        <Modal
                                            open={isModaOpen}
                                            onClose={handleCloseModal}
                                            aria-labelledby="delete-confirmation-title"
                                            aria-describedby="delete-confirmation-description"
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: 400,
                                                    bgcolor: 'background.paper',
                                                    boxShadow: 24,
                                                    p: 4,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography
                                                    id="delete-confirmation-title"
                                                    variant="h6"
                                                    gutterBottom
                                                >
                                                    Confirm Deletion
                                                </Typography>
                                                <Typography
                                                    id="delete-confirmation-description"
                                                    variant="body1"
                                                    gutterBottom
                                                >
                                                    Are you sure you want to delete the selected
                                                    items?
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        gap: 2,
                                                        mt: 3,
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleCloseModal}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={handleConfirmDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Modal>
                                    </>
                                }
                            />

                            <Table>
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            dataFiltered.map(([taskKey]) => taskKey)
                                        )
                                    }
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                />
                                <TableBody>
                                    {dataFiltered.length > 0 ? (
                                        dataFiltered
                                            .slice(
                                                table.page * table.rowsPerPage,
                                                table.page * table.rowsPerPage + table.rowsPerPage
                                            )
                                            .map(([taskKey, taskValue]) => (
                                                <CustomTableRow
                                                    key={taskKey}
                                                    task={taskValue}
                                                    selected={table.selected.includes(taskKey)}
                                                    onSelectRow={() => table.onSelectRow(taskKey)}
                                                    loading={loading}
                                                />
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableEmptyRows
                                                height={table.dense ? 56 : 56 + 20}
                                                emptyRows={emptyRows(
                                                    table.page,
                                                    table.rowsPerPage,
                                                    dataFiltered.length
                                                )}
                                            />
                                            <TableCell colSpan={14}>
                                                <EmptyContent filled sx={{ py: 1 }} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </TableContainer>

                    <TablePaginationCustom
                        page={table.page}
                        dense={table.dense}
                        count={dataFiltered.length}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onChangeDense={table.onChangeDense}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                    />
                </Card>
            </Stack>
        </DashboardContent>
    );
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a[1], b[1], orderBy)
        : (a, b) => -descendingComparator(a[1], b[1], orderBy);
}
