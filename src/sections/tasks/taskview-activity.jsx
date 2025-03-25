import React, { useState, useEffect, useContext } from 'react';

import { LoadingButton } from '@mui/lab';
import CommentIcon from '@mui/icons-material/Comment';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import {
    Box,
    Tab,
    List,
    Tabs,
    Stack,
    Avatar,
    ListItem,
    TextField,
    Typography,
    ListItemText,
    ListItemIcon,
    InputAdornment,
    ListItemAvatar,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { AuthContext } from 'src/auth/context/auth-context';

const ActivitySection = ({ issueKey, refreshActivity }) => {
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState('comments');
    const [comments, setComments] = useState([]);
    const [history, setHistory] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    const fetchCommentsAndHistory = async () => {
        try {
            const [commentsResponse, historyResponse] = await Promise.all([
                axiosInstance.get(endpoints.comments.list),
                axiosInstance.get(endpoints.history.list),
            ]);

            const filteredComments = commentsResponse.data.filter(
                (comment) => comment.task_id === issueKey
            );

            const filteredHistory = historyResponse.data.filter(
                (entry) => entry.task_id === issueKey
            );

            setComments(
                filteredComments.map((comment) => ({
                    employee_name: comment.employee_name,
                    time: comment.date,
                    text: comment.value,
                }))
            );

            setHistory(filteredHistory);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        setLoading(true);
        const commentData = {
            employee_id: user.employee_id,
            task_id: issueKey,
            value: newComment,
        };

        try {
            const response = await axiosInstance.post(endpoints.comments.create, commentData);

            setComments((prev) => [
                {
                    employee_name: response.data.employee_name,
                    time: response.data.date,
                    text: response.data.value,
                },
                ...prev,
            ]);

            const newHistoryEntry = {
                description: `${response.data.employee_name} added a comment : "${response.data.value}"`,
                timestamp: new Date().toLocaleString(),
            };

            setHistory((prev) => [newHistoryEntry, ...prev]);

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommentsAndHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueKey, refreshActivity]);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <Stack gap={2}>
            <Typography variant="subtitle2">Activity</Typography>
            <Box
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                }}
            >
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    sx={{
                        px: 2.5,
                        boxShadow: (theme) => `inset 0 -2px 0 0 rgba(0, 0, 0, 0.08)`,
                    }}
                >
                    <Tab iconPosition="end" label="Comments" value="comments" />
                    <Tab iconPosition="end" label="History" value="history" />
                </Tabs>
                {tab === 'comments' && (
                    <List
                        sx={{
                            maxHeight: 230,
                            overflowY: 'auto',
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            p: 1,
                            boxShadow: 1,
                        }}
                    >
                        {comments.length === 0 ? (
                            <EmptyContent filled title="No Comments available" />
                        ) : (
                            comments.map((comment, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            bgcolor: 'grey.100',
                                            borderRadius: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'secondary.less',
                                                    color: 'common.white',
                                                }}
                                            >
                                                {comment.employee_name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="text.primary"
                                                        sx={{ fontWeight: 'bold' }}
                                                    >
                                                        {comment.employee_name}
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {comment.time}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mt: 1,
                                                        fontSize: '0.9rem',
                                                        wordWrap: 'break-word',
                                                    }}
                                                >
                                                    {comment.text}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </React.Fragment>
                            ))
                        )}
                    </List>
                )}

                {tab === 'history' && (
                    <List sx={{ maxHeight: 230, overflowY: 'auto', padding: 1 }}>
                        {history.length === 0 ? (
                            <EmptyContent filled title="No History available" />
                        ) : (
                            history.map((entry, index) => {
                                const descriptionRegex = /(.+?) changed (\w+) from (.+) to (.+)/i;
                                const match = descriptionRegex.exec(entry.description);

                                const commentRegex = /(\w+) added a comment : (.+)/i;
                                const commentMatch = commentRegex.exec(entry.description);

                                const formatDate = (value) => {
                                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                                    if (dateRegex.test(value)) {
                                        const date = new Date(value);
                                        return date.toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        });
                                    }
                                    return value;
                                };

                                if (match) {
                                    const [_, employeeName, field, oldValue, newValue] = match;
                                    return (
                                        <ListItem
                                            key={index}
                                            alignItems="flex-start"
                                            sx={{ paddingY: 1 }}
                                        >
                                            <ListItemIcon>
                                                <ChangeCircleIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: 500 }}
                                                    >
                                                        <span style={{ fontWeight: 600 }}>
                                                            {employeeName}
                                                        </span>{' '}
                                                        changed{' '}
                                                        <span
                                                            style={{
                                                                color: '#1976d2',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {field.replace(/_id$/, '')}
                                                        </span>{' '}
                                                        from{' '}
                                                        <span style={{ color: '#e57373' }}>
                                                            {oldValue}
                                                        </span>{' '}
                                                        to{' '}
                                                        <span style={{ color: '#81c784' }}>
                                                            {newValue}
                                                        </span>
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {formatTimestamp(entry.timestamp)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    );
                                }

                                if (commentMatch) {
                                    const [_, employeeName, commentText] = commentMatch;
                                    return (
                                        <ListItem
                                            key={index}
                                            alignItems="flex-start"
                                            sx={{ paddingY: 1 }}
                                        >
                                            <ListItemIcon>
                                                <CommentIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: 500 }}
                                                    >
                                                        <span style={{ fontWeight: 600 }}>
                                                            {employeeName}
                                                        </span>{' '}
                                                        added a comment:
                                                    </Typography>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="div"
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ marginRight: 0.5 }}
                                                        >
                                                            {commentText}
                                                        </Typography>
                                                        <Typography
                                                            component="span"
                                                            variant="caption"
                                                            color="text.disabled"
                                                        >
                                                            {formatTimestamp(entry.timestamp)}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    );
                                }
                                return null;
                            })
                        )}
                    </List>
                )}
            </Box>

            <TextField
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                placeholder="Add a comment..."
                variant="outlined"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <LoadingButton
                                variant="contained"
                                loading={loading}
                                startIcon={<Iconify icon="mingcute:add-fill" />}
                                onClick={addComment}
                            >
                                Add Comment
                            </LoadingButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Stack>
    );
};

export default ActivitySection;
