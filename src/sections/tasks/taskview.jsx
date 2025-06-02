import dayjs from 'dayjs';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack, Typography, IconButton, Breadcrumbs } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { AuthContext } from 'src/auth/context/auth-context';

import useTasks from './hooks/useTasks';
import Sidebar from './task-view-sidebar';
import IssueHeader from './taskview-issueheader';
import ActivitySection from './taskview-activity';
import ChildIssues from './task-view-child-issues';
import DescriptionSection from './taskview-description';
import AttachmentsComponent from './taskview-attachments';

const Taskview = ({ handleClose, issueKey, isChild, taskname }) => {
    const { tasks, subTasks, updateSubTask, updateTask } = useTasks();
    const [tempTask, setTempTask] = useState({});
    const [attachedFiles, setAttachedFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [showChildIssue, setShowChildIssue] = useState(true);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [refreshActivity, setRefreshActivity] = useState(false);
    const { employees } = useSelector((state) => state.assignee);
    const [loadingState, setLoadingState] = useState(false);
    const [loadDelete, setLoadDelete] = useState(false);
    const [showAttachedFiles, setShowAttachedFiles] = useState([]);
    const stages = useSelector((state) => state.stages.stages);
    const Stage = id ? stages.find((stage) => stage.id === id) : null;
    const handleAttachFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            setAttachedFiles((prevFiles) => [...prevFiles, file]);
        }
    };

    const trimFileName = (fileName, fileType) => {
        const maxLength = 15;
        const trimmedName =
            fileName.length > maxLength ? `${fileName.substring(0, maxLength)}...` : fileName;
        return `${trimmedName} (${fileType})`;
    };

    const onDeleteFile = (index) => {
        setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const onDownloadFile = (file) => {
        const url = URL.createObjectURL(new Blob([file]));
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleChildIssueView = () => {
        setShowChildIssue(!showChildIssue);
    };
    const [previousValues, setPreviousValues] = useState({});

    const handleSave = async () => {
        const updatePayload = {
            ...tempTask,
            assignee_id: tempTask.assignee_id,
            reporter_id: tempTask.reporter_id,
            start_date: tempTask.start_date
                ? dayjs(tempTask.start_date).format('YYYY-MM-DD')
                : null,
            end_date: tempTask.end_date ? dayjs(tempTask.end_date).format('YYYY-MM-DD') : null,
            actual_start_date: tempTask.actual_start_date
                ? dayjs(tempTask.actual_start_date).format('YYYY-MM-DD')
                : null,
            actual_end_date: tempTask.actual_end_date
                ? dayjs(tempTask.actual_end_date).format('YYYY-MM-DD')
                : null,
        };

        try {
            setLoading(true);

            const updateResponse = isChild
                ? await updateSubTask(updatePayload)
                : await updateTask(updatePayload);

            if (updateResponse) {
                toast.success('Updated successfully');

                try {
                    if (
                        previousValues.reporter_id &&
                        previousValues.reporter_id.oldValue !== previousValues.reporter_id.newValue
                    ) {
                        const reporterPayload = {
                            username: user.name,
                            task_name: tempTask.task_name,
                            project_id: Stage.project_id || 'No Project Name',
                            email: employees[tempTask.reporter_id]?.email || '',
                            stage: Stage.stage_name,
                            link: `/dashboard/stages/${Stage.project_id}/${Stage.id}/view`
                        };

                        await axiosInstance.post(endpoints.tasks.reporter, reporterPayload, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    }

                    if (
                        previousValues.assignee_id &&
                        previousValues.assignee_id.oldValue !== previousValues.assignee_id.newValue
                    ) {
                        const assigneePayload = {
                            username: user.name,
                            task_name: tempTask.task_name,
                            project_id: Stage.project_id,
                            email: employees[tempTask.assignee_id]?.email || '',
                            stage: Stage.stage_name,
                            link: `/dashboard/stages/${Stage.project_id}/${Stage.id}/view`
                        };
                        await axiosInstance.post(endpoints.tasks.assignee, assigneePayload, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const emailNotificationPayload = {
                            employee_id: tempTask.assignee_id,
                            task_name: assigneePayload.task_name,
                            stage_name: assigneePayload.stage,
                            email: assigneePayload.email,
                            project_id: assigneePayload.project_id,
                            // link: `https://www.teamxel.com${assigneePayload.link}`,
                            link: assigneePayload.link,
                          };

                          // await axiosInstance.post(endpoints.email_notification.create, emailNotificationPayload, {
                          await axiosInstance.post(endpoints.email_notification.create, emailNotificationPayload, {
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          });
                        }
                } catch (notifyErr) {
                    console.error('Failed to send notifications:', notifyErr);
                    toast.error('Failed to send notifications');
                }

                const mapIdToName = (emp_id) => employees[emp_id]?.name || emp_id;

                const changeLogs = Object.entries(previousValues)
                    .filter(([key, { oldValue, newValue }]) => oldValue !== newValue)
                    .map(([key, { oldValue, newValue }]) => ({
                        task_id: tempTask.task_id,
                        employee_id: user.employee_id,
                        action: key,
                        old_value:
                            key === 'assignee_id' || key === 'reporter_id'
                                ? mapIdToName(oldValue)
                                : oldValue,
                        new_value:
                            key === 'assignee_id' || key === 'reporter_id'
                                ? mapIdToName(newValue)
                                : newValue,
                    }));

                await Promise.all(
                    changeLogs.map((log) => axiosInstance.post(endpoints.tasks.actions, log))
                );

                setPreviousValues({});
                setRefreshActivity((prev) => !prev);
                if (attachedFiles.length > 0) {
                    await handleAttachmentFile();
                }
                handleClose();
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const HandleTaskChanges = ({ name, value }) => {
        setTempTask((prev) => {
            const previousValue = prev[name];

            setPreviousValues((prevValues) => (
                 {
                    ...prevValues,
                    [name]: {
                        oldValue: prevValues[name]?.oldValue ?? previousValue,
                        newValue: value,
                    },
                }
            ))

            return { ...prev, [name]: value };
        })
    };


    useEffect(() => {
        if (issueKey) {
            if (isChild) {
                setTempTask({ ...subTasks[issueKey] });
            } else {
                setTempTask({ ...tasks[issueKey] });
            }
        }
    }, [issueKey, tasks, subTasks, isChild]);

    const handleAttachmentFile = async () => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('project_id', tempTask?.project_id || null);
            formData.append('stage_id', tempTask?.stage_id || null);

            if (!isChild) {
                formData.append('task_id', tempTask?.task_id || null);
            } else {
                formData.append('task_id', tempTask?.parent_id || null);
                formData.append('subtask_id', tempTask?.task_id || null);
            }

            attachedFiles.forEach((file) => {
                formData.append('files', file);
            });
            const response = await axiosInstance.post(endpoints.attachments.attachFile, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            const { message, status } = response?.data || {};
            if (status) {
                toast.success('File attached successfully');
            } else {
                toast.error('Failed to attach file');
            }
        } catch (err) {
            console.error('Error Details:', err);
            toast.error('Unable to attach the file');
        } finally {
            setLoading(false);
        }
    };

    const handleGetAttachmentFile = useCallback(async () => {
        try {
            setLoadingState(true);
            let payload;
            if (!isChild) {
                payload = {
                    subtask_id: null,
                    task_id: tempTask?.task_id,
                };
            } else {
                payload = {
                    subtask_id: tempTask?.task_id || null,
                };
            }
            const response = await axiosInstance.post(
                endpoints.attachments.getAttachFile,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );


            const { data, message, status } = response?.data || {};
            if (status) {
                const { database_attachments = [] } = data || {};
                setShowAttachedFiles(database_attachments);
            } else {
                console.error('Error Details');
            }
        } catch (err) {
            console.error('Error Details:', err);
        } finally {
            setLoadingState(false);
        }
    }, [tempTask?.task_id, isChild]);

    useEffect(() => {
        if (tempTask?.task_id || tempTask?.parent_id) {
            handleGetAttachmentFile();
        }
    }, [tempTask?.task_id, tempTask?.parent_id, handleGetAttachmentFile]);

    const handleDeleteFile = async (fileNameToDelete) => {
        try {
            setLoadDelete(true);
            const fileToDelete = showAttachedFiles.find(
                (file) => file.file_name === fileNameToDelete
            );
            let payload;
            if (!isChild) {
                payload = {
                    subtask_id: null,
                    task_id: tempTask?.task_id,
                    file_name: fileToDelete.file_name,
                };
            } else {
                payload = {
                    subtask_id: tempTask?.task_id || null,
                    file_name: fileToDelete.file_name,
                };
            }
            const response = await axiosInstance.delete(endpoints.attachments.deleteFile, {
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { status } = response?.data || {};
            if (status) {
                toast.success('File deleted successfully');
            } else {
                toast.error('Failed to delete the file');
            }
        } catch (err) {
            console.error('Error Details:', err);
            toast.error('Unable to delete the file');
        } finally {
            setLoadDelete(false);
        }
    }; // Include dependencies here

    const handleDownloadFile = async (fileNameToDelete) => {
        try {
            setLoadDelete(true);
            const fileToDownload = showAttachedFiles.find(
                (file) => file.file_name === fileNameToDelete
            );
            let payload;

            if (!isChild) {
                payload = {
                    subtask_id: null,
                    task_id: tempTask?.task_id,
                    file_name: fileToDownload.file_name,
                };
            } else {
                payload = {
                    subtask_id: tempTask?.task_id || null,
                    file_name: fileToDownload.file_name,
                };
            }

            const response = await axiosInstance.post(endpoints.attachments.downloadFile, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const downloadUrl = response.data.download_url;

            if (downloadUrl) {
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileToDownload.file_name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success('File downloaded successfully');
            } else {
                toast.error('Download URL not found');
            }
        } catch (err) {
            console.error('Error Details:', err);
            toast.error('Unable to download the file');
        } finally {
            setLoadDelete(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography sx={{ color: 'text.primary' }}>
                                {Stage.stage_name}
                            </Typography>
                            <Typography sx={{ color: 'text.primary' }}>
                                {tempTask.task_name}
                            </Typography>
                            {/* {isChild?
                               ( <Typography sx={{ color: 'text.primary' }}>
                                    {tempTask.task_name}
                                </Typography> ):null
                            } */}
                        </Breadcrumbs>

                        <IconButton onClick={handleClose}>
                            <Iconify icon="ic:baseline-close" />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid xs={9}>
                    <Scrollbar sx={{ height: '80vh' }}>
                        <Stack gap={2}>
                            <IssueHeader
                                taskName={tempTask.task_name}
                                setTask={HandleTaskChanges}
                                onAttachFile={handleAttachFile}
                                toggleChildIssueView={toggleChildIssueView}
                                issueKey={issueKey}
                                taskname={taskname}
                                isChild={isChild}
                            />

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />

                            <DescriptionSection
                                description={tempTask.description}
                                setDescription={HandleTaskChanges}
                            />

                            <AttachmentsComponent
                                attachedFiles={attachedFiles}
                                onDownloadFile={onDownloadFile}
                                onDeleteFile={onDeleteFile}
                                trimFileName={trimFileName}
                                showAttachedFiles={showAttachedFiles}
                                handleDeleteFile={handleDeleteFile}
                                handleDownloadFile={handleDownloadFile}
                            />

                            {isChild ? null : (
                                <ChildIssues
                                    subTasksId={tempTask.children}
                                    HandleTaskChanges={HandleTaskChanges}
                                    issueKey={issueKey}
                                    taskname={taskname}
                                />
                            )}

                            <ActivitySection
                                issueKey={issueKey}
                                refreshActivity={refreshActivity}
                            />
                        </Stack>
                    </Scrollbar>
                </Grid>

                <Grid xs={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Scrollbar sx={{ height: '60vh' }}>
                        <Sidebar task={tempTask} HandleTaskChanges={HandleTaskChanges} />
                    </Scrollbar>

                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={handleSave}
                        sx={{ mt: 2, alignSelf: 'flex-end' }}
                    >
                        Save
                    </LoadingButton>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Taskview;
