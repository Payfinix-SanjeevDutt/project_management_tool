import React, { useState } from 'react';

import {
    Box,
    Grid,
    Stack,
    Paper,
    Button,
    Avatar,
    Dialog,
    TextField,
    Typography,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

const AssignLeaveModal = ({ open, onClose, selectedEmployee }) => {
    const [casualLeave, setCasualLeave] = useState('');
    const [sickLeave, setSickLeave] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);

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
        if (!settingsSaved) {
            toast.error('Save settings first.');
            return;
        }

        try {
            const payload = {
                employee_ids: [selectedEmployee.id],
                casual_leave: casualLeave,
                sick_leave: sickLeave,
            };

            await axiosInstance.post(endpoints.holiday.assignleave, payload);
            toast.success('Leaves assigned successfully!');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign leaves');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    p: 3,
                    maxHeight: '80vh',
                },
            }}
        >
            <DialogTitle>Assign Leave to {selectedEmployee.name}</DialogTitle>

            <DialogContent dividers>
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Avatar src={selectedEmployee.avatar} sx={{ width: 56, height: 56 }} />
                    <Box>
                        <Typography variant="h6">{selectedEmployee.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedEmployee.email}
                        </Typography>
                    </Box>
                </Stack>

                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Configure Leave Values
                    </Typography>
                    <Grid container spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Casual Leave"
                                type="number"
                                value={casualLeave}
                                onChange={(e) => setCasualLeave(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Sick Leave"
                                type="number"
                                value={sickLeave}
                                onChange={(e) => setSickLeave(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" size="small" onClick={handleSaveSettings}>
                            Save Settings
                        </Button>
                    </Box>
                </Paper>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleAssignLeaves}
                    disabled={!settingsSaved}
                >
                    Assign Leave
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignLeaveModal;
