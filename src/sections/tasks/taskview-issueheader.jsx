import { Stack, Button, TextField, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import CreateTask from './createtask_modal';

const IssueHeader = ({
    taskName,
    setTask,
    onAttachFile,
    toggleChildIssueView,
    issueKey,
    taskname,
    isChild,
}) => {
    const createSubtask = useBoolean();

    return (
        <Stack gap={2} sx={{ mt: 2 }}>
            <TextField
                value={taskName}
                name="task_name"
                label="Task name"
                onChange={(event) => setTask({ name: 'task_name', value: event.target.value })}
            />
            <Stack direction="row" gap={2}>
                <Button
                    variant="outlined"
                    onClick={onAttachFile}
                    startIcon={<Iconify icon="tdesign:attach" />}
                >
                    <Typography variant="body2">Attach</Typography>
                </Button>
                {isChild ? null : (
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="tabler:subtask" />}
                        onClick={createSubtask.onTrue}
                    >
                        <Typography variant="body2">Add sub-task</Typography>
                    </Button>
                )}
                <CreateTask
                    open={createSubtask.value}
                    onClose={createSubtask.onFalse}
                    parent_id={issueKey}
                    taskname={taskname}
                />
                <Button variant="outlined" startIcon={<Iconify icon="line-md:link" />}>
                    <Typography variant="body2">Link Issue</Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

export default IssueHeader;
