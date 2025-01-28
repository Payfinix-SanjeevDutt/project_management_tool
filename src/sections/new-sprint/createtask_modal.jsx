import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { Box, Modal, Stack, Button, MenuItem, TextField, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';

import useTasks from './hooks/useTasks';

export default function CreateTaskModal({
    open,
    onClose,
    assignee,
    setAssignee,
    setIsModalOpen,
    currentSprintId,
    sprints,
    getSprints,
}) {
    const [taskText, setTaskText] = useState('');
    const { createTask } = useTasks();
    const { currentProjectId: project_id } = useSelector((state) => state.projects);
    const isLoading = useBoolean();
    console.log('sprints>', sprints);
    console.log('currentSprintId>', currentSprintId);

    const handleSaveTask = async () => {
        const sprintId = currentSprintId;
        try {
            isLoading.onTrue();
            await createTask({
                project_id,
                sprint_id: sprintId,
                task_name: taskText,
            });
            toast.success('created succesfull');
            getSprints();
        } catch (err) {
            toast.error(err);
        } finally {
            isLoading.onFalse();
            setIsModalOpen(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskText('');
        setAssignee('');
    };
    return (
        <Modal open={open} onClose={onClose}>
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
                    Create New Task
                </Typography>
                <Stack spacing={2}>
                    {/* Task Details Input */}
                    {/* <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Enter a Task
                </Typography> */}
                    <TextField
                        label="Task Details"
                        placeholder="Enter task details"
                        helperText="Enter a task to create"
                        fullWidth
                        value={taskText}
                        onChange={(e) => {
                            console.log('TextField value:', e.target.value); // Debug log
                            setTaskText(e.target.value);
                        }}
                    />

                    {/* Associate Task into stages */}
                    {/* <Typography variant="subtitle1">
                    Associate into Stage
                </Typography> */}
                    <TextField
                        select
                        onChange={(e) => setAssignee(e.target.value)}
                        fullWidth
                        helperText="Associate task into stages"
                        value={assignee}
                        variant="outlined"
                        sx={{ mb: 3 }}
                    >
                        <MenuItem value="Member">Default</MenuItem>
                        <MenuItem value="Admin">Implemention</MenuItem>
                        <MenuItem value="Viewer">Closer</MenuItem>
                        <MenuItem value="Viewer">Planning</MenuItem>
                    </TextField>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="outlined" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={isLoading.value}
                            onClick={() => handleSaveTask(currentSprintId)}
                        >
                            Save
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
}
