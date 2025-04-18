import React, { useState, useEffect } from 'react';

import {
    Box,
    Modal,
    Table,
    Paper,
    Button,
    Backdrop,
    Skeleton,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    TableContainer,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { EmptyContent } from 'src/components/empty-content';

const OverrunModal = ({ open, handleClose, assigneeId, overrunType }) => {
    const [taskData, setTaskData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    useEffect(() => {
        if (open && assigneeId && overrunType) {
            setLoading(true);
            setError('');
            setTaskData([]);

            let fetchOverrun;
            if (overrunType === 'completed_overrun') {
                fetchOverrun = axiosInstance.post(endpoints.user.completed_overrun, {
                    assignee_id: assigneeId,
                });
            } else if (overrunType === 'inprogress_overrun') {
                fetchOverrun = axiosInstance.post(endpoints.user.inprogress_overrun, {
                    assignee_id: assigneeId,
                });
            } else {
                fetchOverrun = axiosInstance.post(endpoints.user.todo, { assignee_id: assigneeId });
            }

            if (fetchOverrun) {
                fetchOverrun
                    .then((res) => {
                        if (res.data?.status) {
                            setTaskData(res.data.data);
                            setEmployeeName(res.data.employee_name || 'Unknown Employee');
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
                    width: { xs: '100%', sm: '85%', md: '85%' },
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
                            {loading ? <Skeleton width={200} /> : `${employeeName} :`}
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
                                            <b>Project Name</b>
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
                                        {overrunType !== 'pending_tasks' && (
                                            <TableCell align="center">
                                                <b>Actual Start Date</b>
                                            </TableCell>
                                        )}
                                        {overrunType !== 'inprogress_overrun' &&
                                            overrunType !== 'pending_tasks' && (
                                                <TableCell align="center">
                                                    <b>Actual End Date</b>
                                                </TableCell>
                                            )}
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
                                        : taskData.map((task) => {
                                              const formatDate = (dateStr) => {
                                                  if (!dateStr) return '-';
                                                  const date = new Date(dateStr);
                                                  return `${date.getFullYear()}-${date.toLocaleString(
                                                      'en-US',
                                                      {
                                                          month: 'short',
                                                      }
                                                  )}-${date.getDate()}`;
                                              };

                                              return (
                                                  <TableRow key={task.task_id}>
                                                      <TableCell align="center">
                                                          {task.project_name}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {task.stage_name}
                                                      </TableCell>
                                                      <TableCell
                                                          sx={{
                                                              whiteSpace: 'pre-wrap',
                                                              wordBreak: 'break-word',
                                                              maxWidth: '250px',
                                                          }}
                                                      >
                                                          {task.task_name
                                                              .split(' ')
                                                              .map((word, index) =>
                                                                  (index + 1) % 6 === 0
                                                                      ? `${word}\n`
                                                                      : `${word} `
                                                              )
                                                              .join('')}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {task.status}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {formatDate(task.start_date)}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                          {formatDate(task.end_date)}
                                                      </TableCell>
                                                      {overrunType !== 'pending_tasks' && (
                                                          <TableCell align="center">
                                                              {formatDate(task.actual_start_date)}
                                                          </TableCell>
                                                      )}
                                                      {overrunType !== 'inprogress_overrun' &&
                                                          overrunType !== 'pending_tasks' && (
                                                              <TableCell
                                                                  align="center"
                                                                  sx={{
                                                                      color: 'error.main',
                                                                      fontWeight: 'bold',
                                                                  }}
                                                              >
                                                                  {formatDate(task.actual_end_date)}
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
                                              );
                                          })}
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

export default OverrunModal;
