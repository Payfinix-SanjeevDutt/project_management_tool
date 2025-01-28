import { useMemo, useState } from 'react';

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
    TextField,
    Typography,
    InputAdornment,
    TableContainer,
} from '@mui/material';

import ChildIssuesRow from './sprint-child-issues-row';

// import ChildIssuesRow from './child-issue-row'; // Ensure this is properly implemented

const HEADER_CONFIG = [
    { id: 'Id', label: 'Id', align: 'left' },
    { id: 'Name', label: 'Name', align: 'center' },
    { id: 'Status', label: 'Status', align: 'center' },
    { id: '', label: '', align: 'right' },
];

export default function ChildIssues() {
    const [childIssue, setChildIssue] = useState('');
    const [childIssuesList, setChildIssuesList] = useState([]);

    const calcStatus = useMemo(() => {
        const totalIssues = childIssuesList.length;
        if (totalIssues === 0) return { todo: 0, inProgress: 0, done: 0 }; // Handle no issues case

        const todoCount = childIssuesList.filter((issue) => issue.status1 === 'TO DO').length;
        const inProgressCount = childIssuesList.filter(
            (issue) => issue.status1 === 'IN PROGRESS'
        ).length;
        const doneCount = childIssuesList.filter((issue) => issue.status1 === 'DONE').length;

        return {
            todo: (todoCount / totalIssues) * 100,
            inProgress: (inProgressCount / totalIssues) * 100,
            done: (doneCount / totalIssues) * 100,
        };
    }, [childIssuesList]);

    const handleAddChildIssue = () => {
        if (childIssue.trim()) {
            setChildIssuesList([
                ...childIssuesList,
                { id: `T1S-${childIssuesList.length + 1}`, title: childIssue, status1: 'TO DO' },
            ]);
            setChildIssue('');
        }
    };

    return (
        <Stack direction="column" gap={2}>
            <Typography variant="subtitle2">Child Issues</Typography>

            <Box
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                }}
            >
                <Typography variant="subtitle2">Progress</Typography>

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
                            width: `${calcStatus.done}%`,
                            backgroundColor: 'primary.light',
                            borderRadius: calcStatus.done > 0 ? '5px 0 0 5px' : '5px', // Rounded only if there is progress
                        }}
                    />
                    <Box
                        sx={{
                            width: `${calcStatus.inProgress}%`,
                            backgroundColor: 'info.light',
                        }}
                    />
                    <Box
                        sx={{
                            width: `${calcStatus.todo}%`,
                            backgroundColor: 'warning.light', // Color for 'To Do' tasks
                            borderRadius:
                                calcStatus.todo > 0 && calcStatus.inProgress === 0
                                    ? '0 5px 5px 0'
                                    : '0',
                        }}
                    />
                </Box>

                <TextField
                    value={childIssue}
                    onChange={(e) => setChildIssue(e.target.value)}
                    placeholder="Add child issue"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button variant="contained" onClick={handleAddChildIssue}>
                                    Add
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />

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
                            {childIssuesList.length > 0 ? (
                                childIssuesList.map((issue, index) => (
                                    <ChildIssuesRow key={index} issue={issue} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No child issues added yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Stack>
    );
}
