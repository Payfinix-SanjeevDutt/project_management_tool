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

const ListProjectOverrunModal = ({ open, handleClose, assigneeId, overrunType }) => {
    const [taskData, setTaskData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    console.log(overrunType);

    useEffect(() => {
        if (open && assigneeId && overrunType) {
            setLoading(true);
            setError('');
            setTaskData([]);

            const fetchCompletedOverrun = axiosInstance.post(endpoints.user.completed_overrun, {
                assignee_id: assigneeId,
            });
            const fetchInprogressOverrun = axiosInstance.post(endpoints.user.inprogress_overrun, {
                assignee_id: assigneeId,
            });

            Promise.all([fetchCompletedOverrun, fetchInprogressOverrun])
                .then(([completedRes, inprogressRes]) => {
                    let combinedData = [];

                    if (completedRes.data?.status) {
                        combinedData = [...completedRes.data.data];
                        setEmployeeName(completedRes.data.employee_name || 'Unknown Employee');
                    }

                    if (inprogressRes.data?.status) {
                        combinedData = [...combinedData, ...inprogressRes.data.data];
                    }

                    if (combinedData.length > 0) {
                        setTaskData(combinedData);
                    } else {
                        setError('No tasks found.');
                    }
                })
                .catch(() => {
                    setError('Error fetching data.');
                })
                .finally(() => setLoading(false));
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
                    width: { xs: '90%', sm: '80%', md: '70%' },
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                }}
            >
                {error ? (
                    <Typography variant="body2" color="error" textAlign="center">
                        {error}
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
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
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
                                        <TableCell align="center">
                                            <b>Actual Start Date</b>
                                        </TableCell>
                                        {overrunType !== 'inprogress_overrun' && (
                                            <TableCell align="center">
                                                <b>Actual End Date</b>
                                            </TableCell>
                                        )}
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
                                                  <TableCell align="center">
                                                      {task.actual_start_date}
                                                  </TableCell>
                                                  {overrunType !== 'inprogress_overrun' && (
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

export default ListProjectOverrunModal;
