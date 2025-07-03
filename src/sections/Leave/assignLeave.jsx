import React, { useState, useEffect } from 'react';

import {
    Box,
    Card,
    Grid,
    Stack,
    Paper,
    Button,
    Avatar,
    Checkbox,
    TextField,
    Typography,
    CardHeader,
    CardContent,
    Autocomplete,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';

const AssignLeave = () => {
    const [casualLeave, setCasualLeave] = useState('');
    const [sickLeave, setSickLeave] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get(endpoints.user.list);
            const employeeList = response.data.data.map((emp) => ({
                id: emp.employee_id,
                name: emp.employee_name,
                email: emp.email,
                avatar: emp.avatar || '',
            }));
            setEmployees(employeeList);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch employees');
        }
    };

    const handleSaveSettings = async () => {
        if (!casualLeave || !sickLeave) {
            toast.error('Please enter both Casual and Sick leave values.');
            return;
        }

        try {
            const payload = {
                policies: [
                    { leave_type: 'Casual', default_days: parseInt(casualLeave, 10) },
                    { leave_type: 'Sick', default_days: parseInt(sickLeave, 10) },
                ],
            };

            await axiosInstance.post(endpoints.holiday.createpolicy, payload);
            toast.success('Leave settings saved!');
            setSettingsSaved(true);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        }
    };

    const handleAssignLeaves = async () => {
        if (!settingsSaved || selectedEmployees.length === 0) {
            toast.error('Make sure settings are saved and employees selected.');
            return;
        }

        try {
            const payload = {
                employee_ids: selectedEmployees.map((emp) => emp.id),
                casual_leave: casualLeave,
                sick_leave: sickLeave,
            };

            await axiosInstance.post(endpoints.holiday.assignleave, payload);
            toast.success('Leaves assigned successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign leaves');
        }
    };

    return (
        <DashboardContent maxWidth="md">
            <Card sx={{ p: 4, mt: 10 }}>
                <CardHeader
                    title="Assign Leave"
                    subheader="Define default leave values and assign them to employees"
                />
                <CardContent>
                    <Stack spacing={4}>
                        {/* Leave Settings Section */}
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                1. Configure Leave Values
                            </Typography>
                            <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        label="Casual Leave"
                                        type="number"
                                        value={casualLeave}
                                        onChange={(e) => setCasualLeave(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        label="Sick Leave"
                                        type="number"
                                        value={sickLeave}
                                        onChange={(e) => setSickLeave(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2} display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSaveSettings}
                                        fullWidth
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Employee Selection Section */}
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 0.5 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                2. Assign to Employees
                            </Typography>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={[{ id: 'all', name: 'Select All' }, ...employees]}
                                disabled={!settingsSaved}
                                getOptionLabel={(option) => option.name}
                                value={selectedEmployees}
                                onChange={(e, newValue) => {
                                    const isSelectAll = newValue.some((emp) => emp.id === 'all');

                                    if (isSelectAll) {
                                        const allSelected =
                                            selectedEmployees.length === employees.length;
                                        setSelectedEmployees(allSelected ? [] : employees);
                                    } else {
                                        setSelectedEmployees(newValue);
                                    }
                                }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderOption={(props, option, { selected }) => {
                                    const isSelectAll = option.id === 'all';

                                    return (
                                        <li
                                            {...props}
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <Checkbox
                                                style={{ marginRight: 8 }}
                                                checked={
                                                    isSelectAll
                                                        ? selectedEmployees.length ===
                                                          employees.length
                                                        : selected
                                                }
                                            />
                                            {isSelectAll ? (
                                                <Typography variant="body2" fontWeight="bold">
                                                    Select All
                                                </Typography>
                                            ) : (
                                                <>
                                                    <Avatar
                                                        src={option.avatar}
                                                        sx={{ width: 28, height: 28, mr: 1 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {option.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {option.email}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params} 
                                        label="Select Employees"
                                        placeholder="Search employees..."
                                        fullWidth
                                    />
                                )}
                            />

                            <Box display="flex" justifyContent="flex-end" mt={3}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAssignLeaves}
                                    disabled={!settingsSaved || selectedEmployees.length === 0}
                                >
                                    Assign Leaves
                                </Button>
                            </Box>
                        </Paper>
                    </Stack>
                </CardContent>
            </Card>
        </DashboardContent>
    );
};

export default AssignLeave;
