import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import {
    Box,
    Modal,
    Stack,
    Button,
    TextField,
    Typography,
    Breadcrumbs,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import useTasks from './hooks/useTasks';

export default function CreateTask({ open, onClose, parent_id, taskname }) {
    const { id: stage_id } = useParams();
    const isLoading = useBoolean();
    const { createTask, createSubTask } = useTasks();
    const [task_name, setTaskName] = useState('');
    const { currentProjectId: project_id } = useSelector((state) => state.projects);
    const handleTempName = (value) => {
        setTaskName(value);
    };

    const handleCreateTask = async () => {
        try {
            isLoading.onTrue();
            await createTask({
                project_id,
                stage_id,
                task_name,
                parent_id,
            });
            toast.success('created succesfull');
        } catch (err) {
            toast.error(err);
        } finally {
            isLoading.onFalse();
            onClose();
        }
    };

    const handleCreateSubTask = async () => {
        try {
            isLoading.onTrue();
            await createSubTask({
                project_id,
                stage_id,
                task_name,
                parent_id,
            });
            toast.success('created succesfull');
        } catch (err) {
            toast.error(err);
        } finally {
            isLoading.onFalse();
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Stack
                gap={3}
                sx={{
                    maxWidth: 500,
                    position: 'absolute',
                    width: 400,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                }}
            >
                <Stack sx={{ width: '100%', maxWidth: 500, mx: 'auto' }} gap={3}>
                    <Typography variant="h6">Create {parent_id ? 'Sub Task' : 'Task'}</Typography>
                    <Breadcrumbs aria-label="breadcrumb">
                        {parent_id && (
                            <Label color="info">
                                <Typography variant="subtitle2">{taskname}</Typography>
                            </Label>
                        )}
                        <Label color="info">
                            <Typography variant="subtitle2">{task_name}</Typography>
                        </Label>
                    </Breadcrumbs>

                    <TextField
                        fullWidth
                        placeholder="Ex, Create a report ..."
                        variant="outlined"
                        helperText="Enter name to create a task"
                        value={task_name}
                        onChange={(event) => handleTempName(event.target.value)}
                    />
                </Stack>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        onClick={parent_id ? handleCreateSubTask : handleCreateTask}
                        loading={isLoading.value}
                    >
                        Save
                    </LoadingButton>
                </Box>
            </Stack>
        </Modal>
    );
}
