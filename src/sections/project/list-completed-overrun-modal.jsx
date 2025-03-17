import React, { useState, useEffect } from 'react';

import {
    Box,
    Stack,
    Modal,
    Table,
    Paper,
    Avatar,
    Button,
    Backdrop,
    Skeleton,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
    TableSortLabel,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { EmptyContent } from 'src/components/empty-content';

const ProjectOverrunModal = ({ open, handleClose, assigneeId, overrunType }) => {
    const [taskData, setTaskData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ProjectName, setProjectName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const getAvatarColor = (name) => {
        if (!name) return '#9E9E9E';
        const charCode = name.charAt(0).toUpperCase().charCodeAt(0);
        const colors = [
            '#FF5733',
            '#33FF57',
            '#3357FF',
            '#F39C12',
            '#9B59B6',
            '#E74C3C',
            '#1ABC9C',
            '#D35400',
            '#27AE60',
            '#8E44AD',
        ];
        return colors[charCode % colors.length];
    };
    useEffect(() => {
        if (open && assigneeId && overrunType) {
            setLoading(true);
            setError('');
            setTaskData([]);

            let fetchOverrun;
            if (overrunType === 'completed_overrun') {
                fetchOverrun = axiosInstance.post(endpoints.project.project_completed_overrun, {
                    project_id: assigneeId,
                });
            } else if (overrunType === 'inprogress_overrun') {
                fetchOverrun = axiosInstance.post(endpoints.project.project_inprogress_overrun, {
                    project_id: assigneeId,
                });
            } else {
                fetchOverrun = axiosInstance.post(endpoints.project.project_todo_overrun, { project_id: assigneeId });
            }
            if (fetchOverrun) {
                fetchOverrun
                    .then((res) => {
                        console.log(res.data.data);
                        if (res.data?.status) {
                            setTaskData(res.data.data);
                            setProjectName(res.data.project_name || 'Unknown Project');
                        } else {
                            setError('No tasks found.');
                        }
                    })
                    .catch(() => {
                        setError('Error fetching data.');
                    })
                    .finally(() => setLoading(false));
            }
        }
    }, [open, assigneeId, overrunType]);

    const handleSort = () => {
        const sortedData = [...taskData].sort((a, b) =>
            sortOrder === 'asc'
                ? a.employee_name.localeCompare(b.employee_name)
                : b.employee_name.localeCompare(a.employee_name)
        );
        setTaskData(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    
    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '100%', sm: '85%', md: '90%' },
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                }}
            >
                {error ? (
                    <Typography variant="body2" color="error" textAlign="center">
                        <EmptyContent title="no data" />
                    </Typography>
                ) : (
                    <>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{
                                mb: 2,
                                textAlign: 'left',
                                fontSize: { xs: '1rem', sm: '1.2rem' },
                            }}
                        >
                            {loading ? <Skeleton width={200} /> : `${ProjectName} :`}
                        </Typography>

                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: { xs: 300, sm: 400 },
                                width: '100%',
                                overflowX: 'auto',
                                p: { xs: 1, sm: 2 },
                                mt: 2,
                                borderRadius: 2,
                                boxShadow: 3,
                                borderRight: '1px solid rgba(224, 224, 224, 1)',
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                        <TableSortLabel active direction={sortOrder} onClick={handleSort}>
                                                <b>Employee Name</b>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Stage Name</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Task Name</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Status</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>Start Date</b>
                                        </TableCell>
                                        <TableCell align="center">
                                            <b>End Date</b>
                                        </TableCell>
                                        {overrunType !== 'delayed_tasks' && (
                                            <TableCell align="center">
                                                <b>Actual start date</b>
                                            </TableCell>
                                        )}
                                        {overrunType !== 'inprogress_overrun'&& overrunType !== 'delayed_tasks'&&(
                                            <TableCell align="center">
                                            <b>Actual end date</b>
                                        </TableCell>
                                        )
                                          
                                    }
                                        <TableCell align="center">
                                            <b>Extra days</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading
                                        ? [...Array(5)].map((_, index) => (
                                              <TableRow key={index}>
                                                  {[
                                                      ...Array(
                                                          overrunType !== 'inprogress_overrun'
                                                              ? 6
                                                              : 5
                                                      ),
                                                  ].map((cellIndex) => (
                                                      <TableCell key={cellIndex}>
                                                          <Skeleton />
                                                      </TableCell>
                                                  ))}
                                              </TableRow>
                                          ))
                                        : taskData.map((task) => (
                                              <TableRow key={task.task_id}>
                                                  <TableCell>
                                                      <Stack
                                                          direction="row"
                                                          spacing={2}
                                                          alignItems="center"
                                                      >
                                                          <Avatar
                                                              sx={{
                                                                px: 2,
                                                                py: 0.5,
                                                                  bgcolor: getAvatarColor(
                                                                      task.employee_name
                                                                  ),
                                                                  width: 32,
                                                                  height: 32,
                                                                  fontSize: 16,
                                                              }}
                                                          >
                                                              {task.employee_name
                                                                  ? task.employee_name
                                                                        .charAt(0)
                                                                        .toUpperCase()
                                                                  : '?'}
                                                          </Avatar>
                                                          {task.employee_name}
                                                      </Stack>
                                                  </TableCell>

                                                  <TableCell align="center">
                                                      {task.stage_name}
                                                  </TableCell>
                                                  <TableCell>{task.task_name}</TableCell>
                                                  <TableCell align="center">
                                                      {task.status}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                      {task.start_date}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                      {task.end_date}
                                                  </TableCell>
                                                  {overrunType !== 'delayed_tasks' &&  (
                                                      <TableCell align="center">
                                                          {task.actual_start_date}
                                                      </TableCell>
                                                  )}
                                                  {overrunType !== 'inprogress_overrun' &&
                                                      overrunType !== 'delayed_tasks' && (
                                                          <TableCell
                                                              align="center"
                                                              sx={{
                                                                  color: 'error.main',
                                                                  fontWeight: 'bold',
                                                              }}
                                                          >
                                                              {task.actual_end_date}
                                                          </TableCell>
                                                      )}
                                                  <TableCell
                                                      align="center"
                                                      sx={{
                                                          color: 'error.main',
                                                          fontWeight: 'bold',
                                                      }}
                                                  >
                                                      {task.extra_days}
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button onClick={handleClose} variant="contained">
                                Close
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default ProjectOverrunModal;
