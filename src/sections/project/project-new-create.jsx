import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useState, useEffect, useContext } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Box,
    Card,
    Stack,
    Button,
    Divider,
    TextField,
    CardHeader,
    Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AuthContext } from 'src/auth/context/auth-context';

// import { name } from 'dayjs/locale/en';

//------------------------------------------------------

const STATE = {
    project_id: '',
    name: '',
    status: 'PLANNED',
    description: '',
    start_date: dayjs(),
    end_date: dayjs(),
    actual_start_date: null,
    actual_end_date: null,
    cover_img: null,
};

const PROJECT_STATUS = [
    {
        value: 'ON_GOING',
        label: 'On Going',
    },
    {
        value: 'COMPLETED',
        label: 'Completed',
    },
    {
        value: 'PLANNED',
        label: 'Planned',
    },
];

export default function CreateProject() {
    const { user } = useContext(AuthContext);
    const pathName = usePathname();
    const { currentProjectId: project_id } = useSelector((state) => state.projects);
    const [formData, setFormData] = useState(STATE);
    const navigate = useNavigate();
    const isUpdate = pathName !== '/main/projects/create';
    const handleFormData = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const createProject = async () => {
        try {
            if (!user?.employee_id) {
                throw new Error('employee id is not found');
            }
            const response = await axiosInstance.post(endpoints.project.create, {
                ...formData,
                employee_id: user.employee_id,
            });
            const { error_code, message } = response.data;
            if (error_code !== 0) {
                throw new Error(message);
            }
            toast.success(message);
            navigate(paths.main.project.root);
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message) ||
                error;
            toast.error(errormsg);
        }
    };

    const convertDayjs = (date) => (date ? dayjs(date) : null);
    console.log(project_id)
    const displayProject = async () => {
        try {
            const response = await axiosInstance.post(endpoints.project.display, {
                project_id,
            });

            const { error_code, message, data } = response?.data || {};

            if (error_code !== 0 || !data) {
                throw new Error(message || 'Failed to fetch project');
            }

            setFormData({
                ...data,
                start_date: convertDayjs(data.start_date),
                end_date: convertDayjs(data.end_date),
                actual_start_date: convertDayjs(data.actual_start_date),
                actual_end_date: convertDayjs(data.actual_end_date),
            });
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message) ||
                error;
            toast.error(errormsg);
        }
    };

    const editProject = async () => {
        try {
            const response = await axiosInstance.post(endpoints.project.update, formData);
            const { error_code, message, data } = response.data;
            if (error_code !== 0) {
                throw new Error(message);
            }

            toast.success(message);
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message);
            toast.success(errormsg);
        }
    };

    useEffect(() => {
        if (isUpdate) {
            displayProject();
        }
        // eslint-disable-next-line
    }, [isUpdate]);

    const renderDetails = (
        <Card>
            <CardHeader
                title={isUpdate ? 'update' : 'Create'}
                subheader="Title, short description, etc."
                sx={{ mb: 3 }}
            />
            <Divider />
            <Stack gap={3} sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Typography variant="subtitle2">Project Details</Typography>
                    <TextField
                        name="name"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleFormData}
                    />
                    <TextField
                        name="description"
                        label="Description"
                        multiline
                        value={formData.description}
                        rows={3}
                        variant="outlined"
                        fullWidth
                        onChange={handleFormData}
                    />
                    <TextField
                        fullWidth
                        select
                        name="status"
                        label="Project Status"
                        value={formData.status}
                        onChange={handleFormData}
                    >
                        {PROJECT_STATUS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <Typography variant="subtitle2">Work Schedule</Typography>
                <>
                    <Stack direction="row" gap={2}>
                        <DatePicker
                            label="Start Date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={(newValue) =>
                                handleFormData({
                                    target: { name: 'start_date', value: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                        <DatePicker
                            label="End Date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={(newValue) =>
                                handleFormData({
                                    target: { name: 'end_date', value: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                    </Stack>

                    <Stack direction="row" gap={2}>
                        <DatePicker
                            label="Actual Start Date"
                            name="actual_start_date"
                            value={formData.actual_start_date}
                            onChange={(newValue) =>
                                handleFormData({
                                    target: { name: 'actual_start_date', value: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                        <DatePicker
                            label="Actual End Date"
                            name="actual_end_date"
                            value={formData.actual_end_date}
                            onChange={(newValue) =>
                                handleFormData({
                                    target: { name: 'actual_end_date', value: newValue },
                                })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                    </Stack>
                </>
                <Typography variant="subtitle2">Cover</Typography>
                <Upload
                    name="cover_img"
                    sx={{}}
                    value={formData.files}
                    onDelete={() => {}}
                    onUpload={() => {}}
                    onRemove={() => {}}
                    onRemoveAll={() => {}}
                />
            </Stack>
        </Card>
    );

    const renderButton = (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
            <Stack direction="row" gap={3}>
                <Button color="inherit" variant="outlined" onClick={() => {}}>
                    Back
                </Button>

                <Button
                    color="primary"
                    variant="contained"
                    onClick={isUpdate ? editProject : createProject}
                >
                    {isUpdate ? 'update' : 'save'}
                </Button>
            </Stack>
        </Box>
    );
    return (
        <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CustomBreadcrumbs
                heading="List"
                links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Create' }]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Stack
                spacing={{ xs: 3, md: 5 }}
                sx={{
                    mx: 'auto',
                    minWidth: { xs: 200, md: 800, xl: 880 },
                    maxWidth: { xs: 720, xl: 880 },
                }}
            >
                {renderDetails}
                {renderButton}
            </Stack>
        </DashboardContent>
    );
}
