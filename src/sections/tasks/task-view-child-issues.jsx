import { useMemo } from 'react';

import {
    Box,
    Paper,
    Stack,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import useTasks from './hooks/useTasks';
import CreateTask from './createtask_modal';
import ChildIssuesRow from './child-issue-row';

const HEADER_CONFIG = [
    // { id: 'task_id', label: 'Id', align: 'left' },
    { id: 'task_name', label: 'Name', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'priority', label: 'Priority', align: 'center' },
    { id: '', label: '', align: 'right' },
];

export default function ChildIssues({ HandleTaskChanges, subTasksId = [], issueKey, taskname }) {
    const { subTasks, createSubTask, updateSubTask } = useTasks();
    const createSubtask = useBoolean();

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateSubTask({ task_id: taskId, status: newStatus });

            if (HandleTaskChanges) {
                HandleTaskChanges({ taskId, newStatus });
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const calculateProgress = useMemo(() => {
        const total = subTasksId.length;
        let todo = 0;
        let inProgress = 0;
        let done = 0;

        if (total === 0) return { todo, inProgress, done };

        subTasksId.forEach((id) => {
            if (subTasks[id].status === 'TODO') {
                todo += 1;
            } else if (subTasks[id].status === 'IN_PROGRESS') {
                inProgress += 1;
            } else if (subTasks[id].status === 'DONE') {
                done += 1;
            }
        });
        return {
            todo: (todo / total) * 100,
            inProgress: (inProgress / total) * 100,
            done: (done / total) * 100,
        };
    }, [subTasks, subTasksId]);

    return (
        <Stack direction="column" gap={2}>
            <Typography variant="subtitle2">Sub Task</Typography>
            <Box
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="subtitle2">Progress</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-fill" />}
                            onClick={createSubtask.onTrue}
                        >
                            <Typography variant="subtitle2">Sub task</Typography>
                        </Button>
                        <CreateTask
                            open={createSubtask.value}
                            onClose={createSubtask.onFalse}
                            parent_id={issueKey}
                            taskname={taskname}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        height: 10,
                        backgroundColor: '#ddd',
                        borderRadius: 1,
                        overflow: 'hidden',
                        my: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: `${calculateProgress.done}%`,
                            backgroundColor: 'primary.light',
                            borderRadius: calculateProgress.done > 0 ? '5px 0 0 5px' : '5px',
                        }}
                    />
                    <Box
                        sx={{
                            width: `${calculateProgress.inProgress}%`,
                            backgroundColor: 'info.light',
                        }}
                    />
                    <Box
                        sx={{
                            width: `${calculateProgress.todo}%`,
                            backgroundColor: 'warning.light',
                            borderRadius:
                                calculateProgress.todo > 0 && calculateProgress.inProgress === 0
                                    ? '0 5px 5px 0'
                                    : '0',
                        }}
                    />
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {HEADER_CONFIG.map((it) => (
                                    <TableCell key={it.id} align={it.align}>
                                        {it.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subTasksId.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <EmptyContent title="No sub tasks" />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subTasksId.map((issue) => (
                                    <ChildIssuesRow
                                        issueKey={issueKey}
                                        key={issue}
                                        issue={subTasks[issue]}
                                        taskname={taskname}
                                        onStatusChange={(newStatus) =>
                                            handleStatusChange(issue, newStatus)
                                        }
                                    />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    );
}
