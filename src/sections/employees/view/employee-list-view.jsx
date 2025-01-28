import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { setEmployees } from 'src/redux/slices/project_assignee';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { applyFilter } from 'src/components/phone-input/utils';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import AddEmployeeModal from '../add-employee-modal';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name',width:200 },
    { id: 'email', label: 'Email', width: 250 },
    { id: 'mobile', label: 'Phone Number', width: 200 },
    { id: 'role', label: 'Role', width: 180 },
    { id: 'verification', label: 'Verification', width: 200 },
    { id: 'options', label: '', width: 20 },
];

const proj_roles = ['admin', 'reporter', 'assignee'];

export function EmployeeListView() {
    const table = useTable();
    const router = useRouter();
    const open = useBoolean();
    const dispatch = useDispatch();
    const { employees } = useSelector((state) => state.assignee);
    const projectId = useSelector((state) => state.projects.currentProjectId);
    const filters = useSetState({ name: '', role: [], status: 'all' });

    const dataFiltered = applyFilter({
        inputData: Object.values(employees),
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
    });

    const canReset =
        !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );

    const handleDeleteRow = async (employeeId) => {
        try {
            const response = await axiosInstance.post(endpoints.project.project_user_delete, {
                project_id: projectId,
                employee_id: employeeId,
            });

            if (response.status === 200 ) {
                const updatedEmployees = { ...employees };
                delete updatedEmployees[employeeId];
                dispatch(setEmployees(updatedEmployees));
            } else {
                const error = await response.json();
                console.error('Failed to delete employee:', error.message);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Employee List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Employees', href: paths.dashboard.employees.root },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        onClick={open.onTrue}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        New Employee
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <AddEmployeeModal open={open.value} handleClose={open.onFalse} />

            <Card>
                <UserTableToolbar
                    filters={filters}
                    onResetPage={table.onResetPage}
                    options={{ roles: proj_roles }}
                />

                {canReset && (
                    <UserTableFiltersResult
                        filters={filters}
                        totalResults={dataFiltered.length}
                        onResetPage={table.onResetPage}
                        sx={{ p: 2.5, pt: 0 }}
                    />
                )}

                <Box sx={{ position: 'relative' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={dataFiltered.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        dataFiltered.map((row) => row.id)
                                    )
                                }
                            />

                            <TableBody>
                                {dataFiltered
                                    .slice(
                                        table.page * table.rowsPerPage,
                                        table.page * table.rowsPerPage + table.rowsPerPage
                                    )
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.id}
                                            row={row}
                                            selected={table.selected.includes(row.id)}
                                            onSelectRow={() => table.onSelectRow(row.id)}
                                            onDeleteRow={() => handleDeleteRow(row.id)}
                                            onEditRow={() => handleEditRow(row.id)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={table.dense ? 56 : 56 + 20}
                                    emptyRows={emptyRows(
                                        table.page,
                                        table.rowsPerPage,
                                        dataFiltered.length
                                    )}
                                />

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </Box>

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
        </DashboardContent>
    );
}
