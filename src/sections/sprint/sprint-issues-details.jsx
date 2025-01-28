// import 'react-quill/dist/quill.snow.css';

import { useForm, FormProvider } from 'react-hook-form';
import React, { useRef, useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Tab,
    List,
    Grid,
    Tabs,
    Card,
    Stack,
    Button,
    Avatar,
    Tooltip,
    MenuItem,
    ListItem,
    TextField,
    Typography,
    IconButton,
    ListItemText,
    InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Field } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';

import ChildIssues from './sprint-view-child-issues';

// Issue Header Component
const IssueHeader = ({ summary, onAttachFile, toggleChildIssueView }) => (
    <Stack gap={2}>
        <Typography variant="subtitle1">{summary}</Typography>
        <Stack direction="row" gap={2}>
            <Button
                variant="outlined"
                onClick={onAttachFile}
                startIcon={<Iconify icon="tdesign:attach" />}
            >
                <Typography variant="body2">Attach</Typography>
            </Button>
            {/* Add Child Issue button */}
            <Button
                variant="outlined"
                startIcon={<Iconify icon="tabler:subtask" />}
                onClick={toggleChildIssueView} // Handle button click to toggle child issue view
            >
                <Typography variant="body2">Add Child Issue</Typography>
            </Button>
            <Button variant="outlined" startIcon={<Iconify icon="line-md:link" />}>
                <Typography variant="body2">Link Issue</Typography>
            </Button>
        </Stack>
    </Stack>
);

// Description Section
const DescriptionSection = ({ description, setDescription, updateHistory }) => {
    const [tempDescription, setTempDescription] = useState(description);
    const [isEditing, setIsEditing] = useState(true);

    useEffect(() => {
        setTempDescription(description);
    }, [description]);

    const handleDescriptionChange = (value) => {
        setTempDescription(value);
    };

    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const handleSave = () => {
        const strippedDescription = stripHtmlTags(tempDescription);
        setDescription(strippedDescription);
        updateHistory('Description updated');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempDescription(description);
        setIsEditing(false);
    };

    const toggleEditing = () => {
        setIsEditing(true);
    };

    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <Box mt={3}>
                <Typography variant="h6">Description</Typography>

                <Stack sx={{ mt: 2 }}>
                    {isEditing ? (
                        <Field.Editor
                            name="description"
                            value={tempDescription}
                            onChange={handleDescriptionChange}
                            sx={{ maxHeight: 440, width: 860 }}
                        />
                    ) : (
                        <TextField
                            value={tempDescription}
                            onClick={toggleEditing}
                            variant="outlined"
                            fullWidth
                            multiline
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ cursor: 'pointer', maxHeight: 480, width: 860 }}
                        />
                    )}

                    {isEditing && (
                        <Box mt={2}>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                            >
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="outlined">
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Stack>
            </Box>
        </FormProvider>
    );
};
// Activity Section (Comments & History)
const ActivitySection = ({
    comments,
    history,
    newComment,
    setNewComment,
    addComment,
    handleDeleteComment,
    handleEditComment,
}) => {
    const [tab, setTab] = useState('comments');

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    return (
        <Stack gap={2}>
                <Typography variant="h6">Activity</Typography>
                <Box
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        boxShadow: 1, // Adds subtle shadow
                        p: 2,
                        backgroundColor: '#ffffff',
                        width: 860,
                    }}
                >
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        aria-label="activity-tabs"
                        sx={{
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        {/* <Tab label={<Label color="info">Comments</Label>} value="comments" />
                    <Tab label={<Label color="default">History</Label>} value="history" /> */}
                        <Tab label="Comments" value="comments" />
                        <Tab label="History" value="history" />
                        <Tab label="All" value="all" />
                    </Tabs>
                    {tab === 'comments' && (
                        <>
                            <List sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                                {comments.map((comment, index) => (
                                    <ListItem key={index} alignItems="flex-start">
                                        <Avatar sx={{ mr: 2 }}>{comment.author[0]}</Avatar>
                                        <ListItemText
                                            primary={
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: 1,
                                                        padding: 1,
                                                    }}
                                                >
                                                    <Stack spacing={0.5}>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ fontWeight: 500 }}
                                                            >
                                                                {comment.author}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {comment.time}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" flexDirection="column">
                                                            {comment.text.split('\n').length > 1 ? ( // Check if comment has multiple lines
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="flex-start"
                                                                >
                                                                    {' '}
                                                                    {/* Align items to the left */}
                                                                    <Box
                                                                        display="flex"
                                                                        flexDirection="column"
                                                                        flexGrow={1}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.primary"
                                                                        >
                                                                            {comment.text}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box
                                                                        display="flex"
                                                                        justifyContent="flex-start" // Align the buttons to the left
                                                                        alignItems="center"
                                                                        ml={1} // Add margin-left for spacing
                                                                    >
                                                                        <Tooltip title="Edit">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleEditComment(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                sx={{ mr: 1 }}
                                                                            >
                                                                                <EditIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleDeleteComment(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                            ) : (
                                                                <Box
                                                                    display="flex"
                                                                    justifyContent="space-between"
                                                                    alignItems="center"
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.primary"
                                                                    >
                                                                        {comment.text}
                                                                    </Typography>
                                                                    <Box
                                                                        display="flex"
                                                                        justifyContent="flex-end"
                                                                        alignItems="center"
                                                                        // mt={1}
                                                                    >
                                                                        <Tooltip title="Edit">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleEditComment(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                sx={{ mr: 1 }}
                                                                            >
                                                                                <EditIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleDeleteComment(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Stack>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <TextField
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                fullWidth
                                placeholder="Add a comment..."
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button
                                                variant="contained"
                                                onClick={addComment}
                                                sx={{
                                                    borderRadius: 1,
                                                    textTransform: 'capitalize',
                                                    height: '40px',
                                                    minWidth: '120px',
                                                    padding: '0 16px',
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                Add Comment
                                            </Button>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 1,
                                    borderRadius: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />
                        </>
                    )}

                    {tab === 'history' && (
                        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            {history.map((entry, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {entry.change}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {entry.time}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {tab === 'all' && (
                        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
                            {history.map((entry, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {entry.change}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {entry.time}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Stack>
    );
};

// Sidebar (Details)
const Sidebar = ({ status, assignee, setAssignee, reporter, handleStatusChange, setReporter }) => (
    <Box>
        <Scrollbar sx={{ height: '590px' }}>
            <Stack gap={2} width={275}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt:1, alignItems:'center' }}>
                    <TextField
                        select
                        label="Status"
                        value={status}
                        onChange={handleStatusChange}
                        fullWidth
                    >
                        <MenuItem value="todo">To Do</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </TextField>
 
                    {/* <TaskViewToolbar /> */}
                </Box>
 
                <Typography variant="subtitle1">Details</Typography>
 
                <TextField
                    select
                    fullWidth
                    label="Assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                >
                    <MenuItem value="Unassigned">Unassigned</MenuItem>
                    <MenuItem value={assignee}>{assignee}</MenuItem>
                </TextField>
 
                <TextField placeholder="Add parent..." variant="outlined" fullWidth>None</TextField>
                <TextField placeholder="Start date" variant="outlined" fullWidth />
                <TextField placeholder="Actual start date" variant="outlined" fullWidth />
                <TextField placeholder="End date" variant="outlined" fullWidth />
                <TextField placeholder="Actual end date" variant="outlined" fullWidth />
                <TextField placeholder="Add sprint..." variant="outlined" fullWidth />
 
                <TextField
                    select
                    fullWidth
                    label="Creator"
                    value={reporter} // Ensure this is the correct value
                    onChange={(e) => setReporter(e.target.value)} // Assuming you meant to handle reporter
                >
                    <MenuItem value="Unassigned">Unassigned</MenuItem>
                    <MenuItem value={reporter}>{reporter}</MenuItem>
                </TextField>
            </Stack>
        </Scrollbar>
    </Box>
);

// Main Modal Component
const SprintEdit = ({ issueKey, summary, issueDeatils, items, handleModalClose }) => {
    const [status, setStatus] = useState(issueDeatils.status || 'To Do');
    const [description, setDescription] = useState('');
    const [comments, setComments] = useState([
        { author: 'Niveditha', text: 'hi', time: '18 hours ago' },
    ]);
    const [newComment, setNewComment] = useState('');
    const [history, setHistory] = useState([
        { change: 'Status set to "To Do"', time: '18 hours ago' },
        { change: 'Description updated', time: '17 hours ago' },
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [assignee, setAssignee] = useState(issueDeatils.assignedEmployeeName || 'None');
    const [labels, setLabels] = useState('');
    const [storyPoints, setStoryPoints] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [newIssue, setNewIssue] = useState('');
    const [childIssues, setChildIssues] = useState([]);
    const [reporter, setReporter] = useState(issueDeatils.assignedEmployeeName || 'None');
    const [showChildIssue, setShowChildIssue] = useState(false);

    const [attachedFiles, setAttachedFiles] = useState([]); // State to store attached files
    const fileInputRef = useRef(null);
    console.log("issueDeatils>>", issueDeatils);
    
    const handleAttachFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            setAttachedFiles((prevFiles) => [...prevFiles, file]); // Update attached files state
        }
    };

    const updateHistory = (change) => {
        setHistory([...history, { change, time: new Date().toLocaleString() }]);
    };

    const handleStatusChange = (e) => {
        console.log('handleStatusChange called with:', e.target.value);
        setStatus(e.target.value);
        updateHistory(`Status changed to "${e.target.value}"`);
    };

    useEffect(() => {
        console.log('status??', status);
    }, [status]);

    const handleDeleteComment = (index) => {
        const updatedComments = comments.filter((_, i) => i !== index);
        setComments(updatedComments);
        updateHistory(`Comment deleted by ${comments[index].author}`);
    };

    const handleEditComment = (index) => {
        setNewComment(comments[index].text);
        setIsEditing(true);
        setEditingIndex(index);
    };

    const addComment = () => {
        if (newComment.trim()) {
            const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-GB', dateOptions);

            if (isEditing) {
                // Edit existing comment
                const updatedComments = comments.map((comment, i) =>
                    i === editingIndex
                        ? { ...comment, text: newComment, time: formattedDate }
                        : comment
                );
                setComments(updatedComments);
                updateHistory(`Comment edited by ${comments[editingIndex].author}`);
                setIsEditing(false);
                setEditingIndex(null);
            } else {
                // Add new comment
                setComments([
                    ...comments,
                    {
                        author: 'Niveditha',
                        text: newComment,
                        time: formattedDate,
                    },
                ]);
                updateHistory(`Comment added by Niveditha`);
            }

            setNewComment(''); // Clear the input field after adding or editing
        }
    };

    const trimFileName = (fileName) => {
        const maxLength = 20;
        return fileName.length > maxLength ? `${fileName.substring(0, maxLength)}...` : fileName;
    };

    const onDeleteFile = (index) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Handle file download (example)
    const onDownloadFile = (file) => {
        const url = URL.createObjectURL(new Blob([file])); // Create a blob URL for download
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name; // Set the download filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleSaveIssue = () => {
        if (newIssue) {
            setChildIssues([...childIssues, newIssue]);
            setNewIssue('');
            setShowInput(false);
        }
    };

    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleSave = () => {
        setIsEdit(false);
    };

    const toggleChildIssueView = () => {
        setShowChildIssue(!showChildIssue); // Toggle the child issue section visibility
    };

    return (
        <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} md={9}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16, // Adjust top position as needed
                        right: 16, // Change 'left' to 'right' to position it on the right side
                        zIndex: 10,
                    }}
                >
                    <Iconify
                        icon="ep:close-bold"
                        style={{ color: 'black', cursor: 'pointer' }}
                        onClick={handleModalClose} // Add the close functionality
                    />
                </Box>
                <Scrollbar sx={{ height: '80vh' }}>
                    <Stack gap={3}>
                        {/* Header */}
                        <IssueHeader
                            issueKey={issueKey}
                            issueDeatils={issueDeatils}
                            summary={summary}
                            onAttachFile={handleAttachFile}
                            status={status}
                            handleStatusChange={handleStatusChange}
                            items={items}
                            showInput={showInput}
                            setShowInput={setShowInput}
                            toggleChildIssueView={toggleChildIssueView}
                        />
                        {/* Attach File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        {/* Description */}
                        <DescriptionSection
                            description={description}
                            setDescription={setDescription}
                            updateHistory={updateHistory}
                        />
                        {/* Render attached files below the description */}
                        <Stack spacing={2} mt={4}>
                            {attachedFiles.length > 0 && ( // Render "Attachments" only if files are attached
                                <>
                                    <Typography variant="h6">Attachments</Typography>
                                    <Box
                                        gap={3}
                                        display="grid"
                                        gridTemplateColumns={{
                                            xs: 'repeat(1, 1fr)',
                                            md: 'repeat(4, 1fr)',
                                        }}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            p: 1,
                                            width: 860,
                                        }}
                                    >
                                        {attachedFiles.map((file, index) => (
                                            <Box
                                                key={index}
                                                component={Card}
                                                sx={{
                                                    width: 200,
                                                    height: 160,
                                                    borderRadius: 0.5,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    '&:hover .icon-container': {
                                                        opacity: 1,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    {file.type.startsWith('image/') ? (
                                                        <Box
                                                            component="img"
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            sx={{
                                                                width: 200,
                                                                height: 100,
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    ) : file.type.startsWith('video/') ? (
                                                        <Box
                                                            component="video"
                                                            src={URL.createObjectURL(file)}
                                                            controls
                                                            sx={{
                                                                width: 200,
                                                                height: 100,
                                                            }}
                                                        />
                                                    ) : null}
                                                </Box>
                                                <Stack p={1}>
                                                    <Typography variant="caption">
                                                        {trimFileName(file.name)}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        21-09-2024
                                                    </Typography>
                                                </Stack>

                                                {/* Icon Container */}
                                                <Box
                                                    className="icon-container"
                                                    sx={{
                                                        p: 1,
                                                        flexShrink: 0,
                                                        position: 'absolute',
                                                        top: 1,
                                                        right: 1,
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s',
                                                        display: 'flex',
                                                        gap: 1,
                                                    }}
                                                >
                                                    {/* Download Icon */}
                                                    <Box onClick={() => onDownloadFile(file)}>
                                                        <Iconify
                                                            icon="line-md:downloading-loop"
                                                            style={{ color: 'white' }}
                                                        />
                                                    </Box>
                                                    {/* Delete Icon */}
                                                    <Box onClick={() => onDeleteFile(index)}>
                                                        <Iconify
                                                            icon="icon-park-solid:delete-one"
                                                            style={{ color: 'white' }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Stack>

                        {/* Display input field if 'Add Child Issue' is clicked */}
                        {showInput && (
                            <Stack direction="column" gap={2} alignItems="flex-start">
                                <TextField
                                    label="New Child Issue"
                                    variant="outlined"
                                    fullWidth
                                    value={newIssue}
                                    onChange={(e) => setNewIssue(e.target.value)}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        },
                                        width: 860,
                                    }}
                                />
                                <Stack
                                    direction="row"
                                    gap={2}
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    width="860px"
                                >
                                    <Button
                                        variant="contained"
                                        onClick={handleSaveIssue}
                                        sx={{
                                            borderRadius: 1,
                                            textTransform: 'capitalize',
                                            height: '40px',
                                            minWidth: '40px',
                                        }}
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setShowInput(false); // Hide input when canceling
                                            setNewIssue(''); // Clear the input field
                                        }}
                                        sx={{
                                            borderRadius: 1,
                                            textTransform: 'capitalize',
                                            height: '40px',
                                            minWidth: '40px',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Stack>
                        )}

                        {/* Display list of child issues */}
                        {/* {childIssues.length > 0 && (
                            <Stack mt={4}>
                                <Typography variant="h6">Child Issues</Typography>
                                <Box
                                    mt={2}
                                    sx={{
                                        width: 860,
                                        p: 2,
                                        borderRadius: 1,
                                        border: '1px solid #e0e0e0',
                                    }}
                                >
                                    {childIssues.map((issue, index) => (
                                        <Box
                                            key={index}
                                            p={2}
                                            sx={{
                                                boxShadow: 2,
                                                borderRadius: 1,
                                                mb: 2,
                                                // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack direction="row" alignItems="center" gap={2}>
                                                    <Iconify
                                                        icon="pajamas:issues"
                                                        style={{
                                                            color: 'lightblue',
                                                            fontSize: '24px',
                                                        }}
                                                    />
                                                    {issueDeatils?.map((issues, val) => (
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ fontWeight: 'bold' }}
                                                        >
                                                            {issues.issueName}
                                                        </Typography>
                                                    ))}
                                                    <Box
                                                        position="relative"
                                                        display="flex"
                                                        alignItems="center"
                                                    >
                                                        {isEdit ? (
                                                            <TextField
                                                                variant="outlined"
                                                                size="small"
                                                                defaultValue={issue} // Use defaultValue to show current issue text
                                                                onBlur={handleSave} // Save when the field loses focus
                                                                autoFocus
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handleSave(issue); // Save on Enter key
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography variant="body1">
                                                                {issue}
                                                            </Typography>
                                                        )}

                                                        <IconButton
                                                            size="small"
                                                            onClick={handleEdit}
                                                            sx={{
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s',
                                                                '&:hover': { opacity: 1 },
                                                                ml: 1,
                                                                position: 'absolute',
                                                                right: -60,
                                                            }}
                                                        >
                                                            <Iconify
                                                                icon="eva:edit-fill"
                                                                style={{ fontSize: '20px' }}
                                                            />
                                                        </IconButton>
                                                    </Box>
                                                </Stack>

                                                <Stack direction="row" alignItems="center" gap={3}>
                                                    {issueDeatils?.map((issues, val) => (
                                                        <React.Fragment key={val}>
                                                            <Box display="flex" alignItems="center">
                                                                <Avatar
                                                                    src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-5.webp"
                                                                    alt="Reece Chung"
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        mr: 0.5,
                                                                    }}
                                                                />
                                                                <Typography variant="body1">
                                                                    {issues.assignedEmployeeName}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                label={issues.status}
                                                                color={
                                                                    issues.status === 'Completed'
                                                                        ? 'success'
                                                                        : 'default'
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Box>
                            </Stack>
                        )} */}

                        {/* Conditionally render Child Issues Section */}
                        {showChildIssue && <ChildIssues  setChildIssues= {setChildIssues} handleSaveIssue={handleSaveIssue} childIssues={childIssues} issueDeatils={issueDeatils}/>}

                        {/* Activity (Comments & History) */}
                        <ActivitySection
                            comments={comments}
                            history={history}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            addComment={addComment}
                            handleDeleteComment={handleDeleteComment}
                            handleEditComment={handleEditComment}
                        />
                    </Stack>
                </Scrollbar>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={3}>
                <Sidebar
                    assignee={assignee}
                    setAssignee={setAssignee}
                    labels={labels}
                    setLabels={setLabels}
                    issueDeatils={issueDeatils}
                    handleStatusChange={handleStatusChange}
                    storyPoints={storyPoints}
                    setStoryPoints={setStoryPoints}
                    reporter={reporter}
                    setReporter={setReporter}
                />
            </Grid>
        </Grid>
    );
};

export default SprintEdit;
