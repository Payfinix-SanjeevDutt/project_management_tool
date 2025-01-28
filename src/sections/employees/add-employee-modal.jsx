import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import {
    Box,
    Chip,
    Modal,
    Button,
    MenuItem,
    TextField,
    Typography,
    Autocomplete,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { addEmployee } from 'src/redux/slices/project_assignee';

import { toast } from 'src/components/snackbar';

export default function AddEmployeeModal({ handleClose, open = false }) {
    const project_id = useSelector((state) => state.projects.currentProjectId);
    const [role, setRole] = useState('Member');
    const dispatch = useDispatch()
    const [employees, setEmployees] = useState([]);
    const [selected, setSelected] = useState([]);
    const loading = useBoolean();
    const submitting = useBoolean();

    const fetchEmails = async () => {
        loading.onTrue();
        try {
            const response = await axiosInstance.get(endpoints.user.list);
            const { status, data } = response.data;
            if (status) {
                setEmployees(data);
            } else {
                console.error('Unexpected response format', response);
            }
        } catch (error) {
            console.error('Failed to fetch emails:', error);
        }
        loading.onFalse();
    };

    const handleAddPerson = (event, newValue) => {
        setSelected(newValue);
    };

    const handleAddEmployees = async () => {
        submitting.onTrue();
        try {
            const payload = {
                project_id,
                role,
                employees: selected.map((user) => user.employee_id),
            };
            const response = await axiosInstance.post(
                endpoints.project.project_users_create,
                payload
            );

            const { status } = response.data;
            if (status) {
                dispatch(
                    addEmployee(
                        selected.map((user) => ({ ...user, role, access_status: 'GRANT' }))
                    )
                );
                toast.success('Existing employees added successfully!');
                handleClose();
            }
        } catch (error) {
            toast.error('failed to add employees');
        }
        submitting.onFalse();
    };

    useEffect(() => {
        if (open) {
            fetchEmails();
        }
        // eslint-disable-next-line
    }, [open]);

    return (
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', md: 500 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add People to Project
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Names and emails
                    </Typography>
                    <Autocomplete
                        multiple
                        options={employees}
                        getOptionLabel={(option) => option.employee_email}
                        value={selected}
                        onChange={handleAddPerson}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    key={index}
                                    label={option.employee_email}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={
                                    loading.value ? 'Loading emails...' : 'Add more people...'
                                }
                                variant="outlined"
                            />
                        )}
                        sx={{ mb: 2 }}
                        loading={loading.value}
                    />

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Role
                    </Typography>
                    <TextField
                        select
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        value={role}
                        variant="outlined"
                        sx={{ mb: 3 }}
                    >
                        <MenuItem value="Member">Member</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                    </TextField>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            disabled={submitting.value}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            onClick={handleAddEmployees}
                            loading={submitting.value}
                        >
                            Add Employees
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
    );
}
