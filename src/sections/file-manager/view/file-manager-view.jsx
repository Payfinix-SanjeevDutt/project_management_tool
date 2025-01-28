import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import WorkIcon from '@mui/icons-material/Work';
import TaskIcon from '@mui/icons-material/Task';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import SchemaIcon from '@mui/icons-material/Schema';
import ToggleButton from '@mui/material/ToggleButton';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Link, Divider, Backdrop, Breadcrumbs } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axiosInstance from 'src/utils/axios';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _allFiles, FILE_TYPE_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { fileFormat } from 'src/components/file-thumbnail';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTable, rowInPage, getComparator } from 'src/components/table';

import { FileManagerTable } from '../file-manager-table';
import { FileManagerFilters } from '../file-manager-filters';
import { FileManagerGridView } from '../file-manager-grid-view';
import { FileManagerFiltersResult } from '../file-manager-filters-result';
import { FileManagerNewFolderDialog } from '../file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

export function FileManagerView() {
    const table = useTable({ defaultRowsPerPage: 10 });

    const openDateRange = useBoolean();

    const confirm = useBoolean();

    const upload = useBoolean();

    const [view, setView] = useState('list');

    console.log('files', _allFiles);

    const [tableData, setTableData] = useState([]);
    const [folderPath, setFolderPath] = useState(null);
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);

    const filters = useSetState({
        name: '',
        type: [],
        startDate: null,
        endDate: null,
        favouriteFilter: false,
    });

    const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: filters.state,
        dateError,
    });

    const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

    const canReset =
        !!filters.state.name ||
        filters.state.type.length > 0 ||
        !!filters.favouriteFilter ||
        (!!filters.state.startDate && !!filters.state.endDate);

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    const handleChangeView = useCallback((event, newView) => {
        if (newView !== null) {
            setView(newView);
        }
    }, []);

    const handleDeleteItem = useCallback(
        (id) => {
            const deleteRow = tableData.filter((row) => row.id !== id);

            toast.success('Delete success!');

            setTableData(deleteRow);

            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table, tableData]
    );

    const handleDeleteItems = useCallback(() => {
        const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

        toast.success('Delete success!');

        setTableData(deleteRows);

        table.onUpdatePageDeleteRows({
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, table, tableData]);

    // const getAccesstoken = useCallback(async () => {
    //     setLoading(true);
    //     const response = await axiosInstance.post('/sharepoint/auth_user');
    //     if (response.data?.status === true) {
    //         setAccessToken(response.data?.access_token);
    //         setLoading(false);
    //     } else {
    //         setAccessToken('');
    //         setLoading(false);
    //     }
    // }, []);

    const listFolders = useCallback(
        async (data) => {
            setLoading(true);
            const payload = {
                access_token: accessToken,
                folder_path: data || folderPath,
            };
            const response = await axiosInstance.post('/sharepoint/get_folder_data', payload);
            if (response.data?.status === true) {
                setTableData(response.data?.files);
                setFolderPath(response.data?.folder_path);
                setLoading(false);
            } else {
                setTableData([]);
                setLoading(false);
            }
        },
        [folderPath, accessToken]
    );

    useEffect(() => {
        if (accessToken) {
            listFolders();
        }
    }, [accessToken, listFolders]);

    // useEffect(() => {
    //     getAccesstoken();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const pathSegments = folderPath ? folderPath.split('/') : [];

    const icons = [FolderIcon, WorkIcon, AccountTreeIcon, TaskIcon, SchemaIcon];

    const renderFilters = (
        <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
        >
            <FileManagerFilters
                filters={filters}
                dateError={dateError}
                onResetPage={table.onResetPage}
                openDateRange={openDateRange.value}
                onOpenDateRange={openDateRange.onTrue}
                onCloseDateRange={openDateRange.onFalse}
                options={{ types: FILE_TYPE_OPTIONS }}
            />

            <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                <ToggleButton value="list">
                    <Iconify icon="solar:list-bold" />
                </ToggleButton>

                <ToggleButton value="grid">
                    <Iconify icon="mingcute:dot-grid-fill" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>
    );

    const renderResults = (
        <FileManagerFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
        />
    );

    return (
        <>
            <DashboardContent>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <LoadingScreen color="inherit" />
                </Backdrop>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4">File manager</Typography>
                </Stack>

                <Stack spacing={2.5} sx={{ my: { xs: 3, md: 5 } }}>
                    {renderFilters}

                    {canReset && renderResults}
                </Stack>
                <Stack
                    direction="row"
                    sx={{ mb: 2 }}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box role="presentation">
                        <Breadcrumbs aria-label="breadcrumb" maxItems={2}>
                            {pathSegments.map((segment, index) => {
                                const IconComponent = icons[index] || SchemaIcon;
                                const isLast = index === pathSegments.length - 1;

                                const handleClick = () => {
                                    const selectedPath = pathSegments.slice(0, index + 1).join('/');
                                    listFolders(selectedPath);
                                };

                                return (
                                    <Link
                                        key={index}
                                        underline="hover"
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                        color={isLast ? 'textPrimary' : 'inherit'}
                                        component="button"
                                        onClick={handleClick}
                                        disabled={isLast}
                                    >
                                        <IconComponent sx={{ mr: 0.5 }} fontSize="inherit" />
                                        {segment}
                                    </Link>
                                );
                            })}
                        </Breadcrumbs>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:cloud-upload-fill" />}
                        onClick={upload.onTrue}
                    >
                        Upload
                    </Button>
                </Stack>
                <Divider variant="middle" sx={{ mb: 2, borderStyle: 'dashed' }} />

                {notFound ? (
                    <EmptyContent title="No Data" filled sx={{ py: 10 }} />
                ) : (
                    <>
                        {view === 'list' ? (
                            <FileManagerTable
                                table={table}
                                folderPath={folderPath}
                                listFolders={listFolders}
                                dataFiltered={dataFiltered}
                                onDeleteRow={handleDeleteItem}
                                notFound={notFound}
                                onOpenConfirm={confirm.onTrue}
                            />
                        ) : (
                            <FileManagerGridView
                                table={table}
                                folderPath={folderPath}
                                listFolders={listFolders}
                                dataFiltered={dataFiltered}
                                onDeleteItem={handleDeleteItem}
                                onOpenConfirm={confirm.onTrue}
                            />
                        )}
                    </>
                )}
            </DashboardContent>

            <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete <strong> {table.selected.length} </strong>{' '}
                        items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteItems();
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

function applyFilter({ inputData, comparator, filters, dateError }) {
    const { name, type, startDate, endDate, favouriteFilter } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter(
            (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        );
    }
    if (favouriteFilter) {
        console.log('favouriteFilter---->', favouriteFilter);
        inputData = inputData.filter((file) => favouriteFilter === file.isFavorited);
    }

    if (type.length) {
        inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
    }

    if (!dateError) {
        if (startDate && endDate) {
            inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
        }
    }

    return inputData;
}
