import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useContext, useCallback } from 'react';

import TextField from '@mui/material/TextField';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
    Box,
    Card,
    Stack,
    Button,
    Avatar,
    Dialog,
    Typography,
    gridClasses,
    DialogTitle,
    ListItemText,
    DialogActions,
    DialogContent,
    InputAdornment,
    Link as NavLink,
    DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { setProject } from 'src/redux/slices/project';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AddEmployeeModal from 'src/sections/employees/add-employee-modal';

import { AuthContext } from 'src/auth/context/auth-context';

//----------------------------------------------------------------------------------
const img1 =
    'https://img.freepik.com/free-vector/project-management-design-concept-symbolizing-analysis-solving-problems-isometric-vector-illustration_1284-77122.jpg';

export default function CustomProjectView() {
    const { user } = useContext(AuthContext);
    const [tabledata, setTableData] = useState([]);
    const router = useRouter();
    const open = useBoolean();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [filters, setfilters] = useState({ searchQuery: '' });
    const projectId = useSelector((state) => state.projects.currentProjectId);

    const dataFilter = applyNewFilter({ inputdata: tabledata, inputfilters: filters });
    const [opendelete, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleOpenModal = (id) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = () => {
        deleteProject(selectedId);
        handleCloseModal();
    };

    const handleSearch = useCallback((event) => {
        setfilters(() => ({ searchQuery: event.target.value }));
    }, []);

    const handleViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.projectdashboard.homestages(id));
            dispatch(setProject({ projectId: id }));
        },
        [router, dispatch]
    );

    const listresult = async () => {
        try {
            const result = await axiosInstance.post(endpoints.project.list, {
                employee_id: user.employee_id,
            });

            const { error_code, message, data } = result.data;

            if (error_code !== 0) {
                throw new Error(message);
            }
            setTableData(data);
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message) ||
                error;
            toast.error(errormsg);
        }
    };

    const deleteProject = async (project_id) => {
        try {
            const response = await axiosInstance.delete(endpoints.project.delete, {
                data: { project_id },
            });

            if (response.status === 200) {
                toast.success('Project deleted successfully', { variant: 'success' });
                listresult();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project', { variant: 'error' });
        }
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Project Name',
            headerAlign: 'center',
            align: 'center',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Avatar
                        alt={params.row.name}
                        src={params.row.cover_img}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '2px solid #fff',  
                        }}
                    />
                    <ListItemText
                        disableTypography
                        primary={
                            <NavLink
                                noWrap
                                color="inherit"
                                variant="subtitle2"
                                onClick={() => handleViewRow(params.row.id)}
                                sx={{
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    '&:hover': {
                                        textDecoration: 'underline',  
                                    },
                                }}
                            >
                                {params.row.name}
                            </NavLink>
                        }
                        secondary={
                            <Box
                                component="div"
                                sx={{
                                    typography: 'body2',
                                    color: 'text.disabled',
                                    textAlign: 'left',
                                }}
                            >
                                {params.row.category}
                            </Box>
                        }
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            minWidth: 0, 
                        }}
                    />
                </Stack>
            ),
        },

        {
            field: 'status',
            flex: 1,
            headerName: 'Status',
            headerAlign: 'center',
            width: 150,
            align: 'center',
            renderCell: (params) => <Label sx={{ mt: 1 }}>{params.row.status}</Label>,
        },
        {
            field: 'lead_name',
            flex: 1,
            headerName: 'Project Lead',
            headerAlign: 'center',
            minWidth: 200,
            align: 'center',
            renderCell: (params) =>
                params.row.lead_id ? (
                    <Stack spacing={1} direction="row" alignItems="center" sx={{ padding: '4px' }}>
                        <Avatar
                            src={params.row.lead_avatar}
                            alt={params.row.lead_name}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Stack
                            sx={{
                                typography: 'body2',
                                flex: '1 1 auto',
                                alignItems: 'flex-start',
                                ml: 1,
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {params.row.lead_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {params.row.lead_email}
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ---
                    </Typography>
                ),
        },

        {
            field: 'start_date',
            headerName: 'Start Date',
            headerAlign: 'center',
            flex: 1,
            type: 'date',
            align: 'center',
            width: 110,
            valueGetter: (value) => new Date(value),
            renderCell: (params) => (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {params.row.start_date ? fDate(params.row.start_date) : '---'}
                </Typography>
            ),
        },
        {
            field: 'end_date',
            headerName: 'End Date',
            headerAlign: 'center',
            flex: 1,
            type: 'date',
            align: 'center',
            width: 110,
            valueGetter: (value) => new Date(value),
            renderCell: (params) => (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {params.row.end_date ? fDate(params.row.end_date) : '---'}
                </Typography>
            ),
        },
        {
            field: 'actual_start_date',
            headerName: 'Actual start date',
            headerAlign: 'center',
            flex: 1,
            type: 'date',
            align: 'center',
            width: 110,
            valueGetter: (value) => new Date(value),
            renderCell: (params) => (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {params.row.actual_start_date ? fDate(params.row.actual_start_date) : '---'}
                </Typography>
            ),
        },
        {
            field: 'actual_end_date',
            headerName: 'Actual end date',
            headerAlign: 'center',
            flex: 1,
            type: 'date',
            align: 'center',
            width: 110,
            valueGetter: (value) => new Date(value),
            renderCell: (params) => (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    {params.row.actual_end_date ? fDate(params.row.actual_end_date) : '---'}
                </Typography>
            ),
        },
        {
            type: 'actions',
            field: 'actions',
            headerName: '',
            headerAlign: 'center',
            align: 'right',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            getActions: (params) => [
                <GridActionsCellItem
                    showInMenu
                    icon={<Iconify icon="iconamoon:settings-fill" />}
                    label="Project settings"
                    onClick={() => {
                        navigate(paths.dashboard.settings.details(projectId));
                    }}
                />,
                <GridActionsCellItem
                    showInMenu
                    icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    label="Move to trash"
                    onClick={() => handleOpenModal(params.row.id)}
                    sx={{ color: 'error.main' }}
                />,
                <GridActionsCellItem
                    showInMenu
                    icon={<Iconify icon="solar:user-plus-bold" />}
                    label="Add Employees"
                    onClick={open.onTrue}
                />,
                <Dialog open={opendelete} onClose={handleCloseModal}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this project? This action cannot be
                            undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>,
            ],
        },
    ];

    useEffect(
        () => {
            if (user?.employee_id) {
                listresult();
            }
        },
        // eslint-disable-next-line
        [user?.employee_id]
    );

    return (
        <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CustomBreadcrumbs
                heading="List"
                links={[{ name: 'Project', href: paths.main.project.root }, { name: 'List' }]}
                sx={{ mb: { xs: 3, md: 5 } }}
                action={
                    <Button
                        variant="contained"
                        href={paths.main.project.create}
                        startIcon={<Iconify icon="lets-icons:add-round" />}
                    >
                        Create
                    </Button>
                }
            />
            <AddEmployeeModal open={open.value} handleClose={open.onFalse} />
            <Card>
                <Stack direction="row" sx={{ p: 3 }} gap={3}>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        fullWidth
                        value={filters.searchQuery}
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="ic:baseline-search" />
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleSearch}
                    />
                </Stack>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <DataGrid
                        rows={dataFilter}
                        slotProps={{
                            loadingOverlay: {
                                variant: 'linear-progress',
                                noRowsVariant: 'linear-progress',
                            },
                        }}
                        sx={{
                            [`& .${gridClasses.cell}`]: {
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                            },
                        }}
                        getRowHeight={() => 'auto'}
                        rowHeight={dataFilter.length === 0 ? 150 : 'auto'}
                        columns={columns}
                        density="comfortable"
                        autoHeight
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        slots={{
                            noRowsOverlay: () => (
                                <EmptyContent
                                    filled
                                    title="No Projects Found"
                                    description="There are currently no projects available."
                                    sx={{ py: 3 }}
                                />
                            ),
                            noResultsOverlay: () => (
                                <EmptyContent
                                    filled
                                    title="No Results Found"
                                    description="Try adjusting your search or filters."
                                    sx={{ py: 3 }}
                                />
                            ),
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>
            </Card>
        </DashboardContent>
    );
}
const applyNewFilter = ({ inputdata, inputfilters }) => {
    const { searchQuery } = inputfilters;

    const query = (searchQuery || '').toLowerCase();

    return inputdata.filter((item) => {
        const { name, status, lead_name } = item;

        return (
            (name || '').toLowerCase().indexOf(query) !== -1 ||
            (status || '').toLowerCase().indexOf(query) !== -1 ||
            (lead_name || '').toLowerCase().indexOf(query) !== -1
        );
    });
};
