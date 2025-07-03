import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Box,
    Card,
    Stack,
    Radio,
    Button,
    Divider,
    TextField,
    CardHeader,
    Typography,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const Holiday = {
    status: 'public_holiday',
    is_optional: 'yes',
    start_date: null,
    end_date: null
};

const Holiday_type = [
    {
        value: 'Public',
        label: 'Public',
    },
    {
        value: 'Religious',
        label: 'Religious',
    },
    {
        value: 'National',
        label: 'National',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];

export default function HolidayCreate() {
    const navigate = useNavigate();
    const pathName = usePathname();
    const [formData, setFormData] = useState(Holiday);

    const isUpdate = pathName !== '/main/projects/create';

    const handleFormData = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axiosInstance.post(endpoints.holiday.create, {
                holiday_name: formData.name,
                start_date: formData.start_date?.format('YYYY-MM-DD'),
                end_date: formData.end_date?.format('YYYY-MM-DD'),
                type: formData.status,
                is_optional: formData.is_optional,
            });

            const data = await response.data;

            if (data.status) {
                toast.success('Holiday created succesfully!');
                // Optionally reset form or redirect
                navigate(paths.main.holiday.list)
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Something went wrong while creating the holiday.');
        }
    };

    const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
};


    const renderDetails = (
        <Card>
            <CardHeader title="Create" subheader="Title, Type, Date etc." sx={{ mb: 3 }} />
            <Divider />
            <Stack spacing={4} sx={{ py: 5, px: 4 }}>
                <Stack spacing={3}>
                    <Typography variant="subtitle2">Holiday Details</Typography>

                    <TextField
                        name="name"
                        label="Holiday Name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleFormData}
                    />

                    <TextField
                        select
                        fullWidth
                        name="status"
                        label="Type of Holiday"
                        value={formData.status}
                        onChange={handleFormData}
                    >
                        {Holiday_type.map((holiday) => (
                            <MenuItem key={holiday.value} value={holiday.value}>
                                {holiday.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack spacing={1}>
                        <Typography variant="subtitle2">Is Optional</Typography>
                        <RadioGroup
                            row
                            name="is_optional"
                            value={formData.is_optional}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_optional: e.target.value,
                                }))
                            }
                        >
                            <FormControlLabel value="True" control={<Radio />} label="Yes" />
                            <FormControlLabel value="False" control={<Radio />} label="No" />
                        </RadioGroup>
                    </Stack>
                </Stack>

                {/* Schedule Section */}
                <Stack spacing={2}>
                    <Typography variant="subtitle2">Schedule</Typography>
                    <Stack direction="row" spacing={2}>
                        <DatePicker
                            label="Start Date"
                            value={formData.start_date}
                            onChange={(newValue) =>
                                handleDateChange('start_date', newValue)
                            }
                            sx={{ flex: 1 }}
                            format="YYYY-MM-DD"
                        />
                        <DatePicker
                            label="End Date"
                            value={formData.end_date}
                            onChange={(newValue) =>
                                handleDateChange('end_date', newValue)
                            }
                            sx={{ flex: 1 }}
                            format="YYYY-MM-DD"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );

    const renderButton = (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
            <Stack direction="row" gap={3}>
                <Button color="inherit" variant="outlined">
                    Back
                </Button>
                <Button color="primary" variant="contained" onClick={() => handleSubmit()}>
                    Save
                </Button>
            </Stack>
        </Box>
    );

    return (
        <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CustomBreadcrumbs
                heading="Holiday"
                links={[{ name: 'Dashboard', href: paths.main.dashboard.root}, { name: 'Create' }]}
                sx={{ mb: { xs: 3, md: 10 } }}
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
