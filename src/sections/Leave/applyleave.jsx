import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import {
    Card,
    Stack,
    Avatar,
    Divider,
    MenuItem,
    TextField,
    CardHeader,
    Typography,
    CardContent,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';

const defaultFormData = {
    employeeId: '',
    leaveType: '',
    reason: '',
    startDate: dayjs(),
    endDate: dayjs(),
};

const ApplyLeave = () => {
    const [formData, setFormData] = useState(defaultFormData);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get(endpoints.user.list);
            const filteredEmployees = response.data.data.map((emp) => ({
                id: emp.employee_id,
                avatar: emp.employee_avatar,
                email: emp.employee_email,
                name: emp.employee_name,
            }));
            setEmployees(filteredEmployees);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load employees');
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                employee_id: formData.employeeId,
                leave_type: formData.leaveType,
                reason: formData.reason,
                start_date: formData.startDate.format('YYYY-MM-DD'),
                end_date: formData.endDate.format('YYYY-MM-DD'),
            };

            const response = await axiosInstance.post(endpoints.holiday.applyleave, payload);

            // Only runs for 2xx responses
            toast.success(response.data.message || 'Leave applied successfully');
            setFormData(defaultFormData);
        } catch (err) {
            console.error('Caught error:', err);

            const status = err?.response?.status;
            const errorMsg = err?.response?.data?.error;

            if (status === 400 && errorMsg) {
                toast.error(errorMsg);
            } else if (errorMsg) {
                toast.error(errorMsg);
            } else {
                toast.error('Server error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent maxWidth="lg">
            <Card sx={{ p: 3, mt: 10 }}>
                <CardHeader
                    title="Leave Application"
                    subheader="Select employee, type, and dates"
                    sx={{ mb: 5 }}
                />
                <Divider />
                <CardContent>
                    <Stack spacing={3}>
                        <TextField
                            select
                            label="Select Employee"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 400,
                                        },
                                    },
                                },
                            }}
                        >
                            {employees.map((emp) => (
                                <MenuItem key={emp.id} value={emp.id}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar
                                            src={emp.avatar || ''}
                                            alt={emp.name}
                                            sx={{ width: 30, height: 30, fontSize: 14 }}
                                        >
                                            {emp.name?.[0]}
                                        </Avatar>
                                        <Stack>
                                            <Typography variant="body2" noWrap>
                                                {emp.name}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                noWrap
                                            >
                                                {emp.email}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Leave Type"
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                        >
                            <MenuItem value="Casual">Casual</MenuItem>
                            <MenuItem value="Sick">Sick</MenuItem>
                            <MenuItem value="Compoff">Comp Off</MenuItem>
                        </TextField>

                        <TextField
                            label="Reason for Leave"
                            name="reason"
                            multiline
                            rows={3}
                            fullWidth
                            value={formData.reason}
                            onChange={handleChange}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <DatePicker
                                label="Start Date"
                                value={formData.startDate}
                                onChange={(newValue) => handleDateChange('startDate', newValue)}
                                sx={{ flex: 1 }}
                            />
                            <DatePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={(newValue) => handleDateChange('endDate', newValue)}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <LoadingButton
                            variant="contained"
                            onClick={handleSubmit}
                            loading={loading}
                            sx={{ alignSelf: 'flex-end', mt: 2 }}
                        >
                            Apply Leave
                        </LoadingButton>
                    </Stack>
                </CardContent>
            </Card>
        </DashboardContent>
    );
};

export default ApplyLeave;
