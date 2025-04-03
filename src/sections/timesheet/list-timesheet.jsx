import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import React, { useState, useEffect, useContext } from 'react';

import { Edit, Delete } from '@mui/icons-material';
import {
    Card,
    Table,
    Paper,
    Stack,
    Button,
    Popover,
    TableRow,
    Checkbox,
    TableBody,
    TableCell,
    IconButton,
    Typography,
    TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { EmptyContent } from 'src/components/empty-content';

import { AuthContext } from 'src/auth/context/auth-context';

const TimesheetTable = ({ startOfWeek, endOfWeek }) => {
    const [rows, setRows] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const openPopover = (event, timesheet_id) => {
        setPopoverAnchor(event.currentTarget);
        setSelectedTimesheet(timesheet_id);
    };

    const closePopover = () => {
        setPopoverAnchor(null);
        setSelectedTimesheet(null);
    };

    const handleDelete = async () => {
        try {
            const response = await axiosInstance.post(endpoints.timesheet.delete, {
                employee_id: user.employee_id,
                timesheet_id: selectedTimesheet,
            });

            if (response.data.status) {
                setRows((prevRows) => prevRows.filter((row) => row.id !== selectedTimesheet));
            } else {
                console.error('Error deleting timesheet:', response.data.message);
            }
        } catch (error) {
            console.error('Failed to delete timesheet:', error);
        }
        closePopover();
    };
    useEffect(() => {
        axiosInstance
            .post(endpoints.timesheet.list, { employee_id: user.employee_id })
            .then((response) => {
                if (response.data.status && response.data.data) {
                    const filteredData = response.data.data.filter((item) => {
                        const itemDate = dayjs(item.startDate);
                        const start = dayjs(startOfWeek);
                        const end = dayjs(endOfWeek);
    
                        return (
                            itemDate.isValid() &&
                            itemDate.isAfter(start.subtract(1, 'day')) &&
                            itemDate.isBefore(end.add(0, 'day'))
                        );
                    });
    
                    const sortedData = filteredData.sort((a, b) => 
                        dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf()
                    );
    
                    const uniqueEntries = new Map();
                    sortedData.forEach((item) => {
                        const formattedDate = dayjs(item.startDate).format('DD-MMM-YYYY');
                        if (!uniqueEntries.has(formattedDate)) {
                            uniqueEntries.set(formattedDate, item);
                        }
                    });
    
                    setRows(
                        Array.from(uniqueEntries.values()).map((item) => ({
                            id: item.timesheet_id,
                            date: dayjs(item.startDate).format('DD-MMM-YYYY'),
                            project: item.project_name,
                            tool: item.job_name,
                            billable: item.billable_status,
                            time: item.total_hours,
                            work_item: item.work_item,
                            employee: item.employee_name,
                            avatar: item.employee_name.charAt(0),
                        }))
                    );
                }
            })
            .catch((error) => {
                console.error('Error fetching timesheet data:', error);
            });
        // eslint-disable-next-line
    }, [startOfWeek, endOfWeek]);

    return rows.length === 0 ? (
        <Card sx={{ py: 25 }}>
            <EmptyContent
                title="No Logs"
                description="No time logs found for this week. Try selecting a different week."
            />
        </Card>
    ) : (
        <>
            <TableContainer
                component={Paper}
                sx={{ borderRadius: '10px', overflow: 'hidden', mt: 6 }}
            >
                <Table>
                    <TableBody>
                        {rows.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? '#F8F6FC' : '#FFFFFF',
                                        borderBottom: '1px solid #E0E0E0',
                                    }}
                                >
                                    <TableCell sx={{ width: '50px' }}>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell sx={{ width: '150px', fontWeight: 'bold' }}>
                                        {row.date}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body1" fontWeight="bold">
                                            {row.project}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {row.tool}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{row.work_item}</TableCell>
                                    <TableCell
                                        sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                    >
                                        {row.description}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                        {row.billable}
                                    </TableCell>
                                    <TableCell sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                        {row.time}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                onClick={() =>
                                                    navigate(
                                                        paths.main.timesheet.edit(
                                                            row.id,
                                                            user.employee_id
                                                        )
                                                    )
                                                }
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={(event) => openPopover(event, row.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                                <TableRow sx={{ height: '20px', backgroundColor: 'transparent' }}>
                                    <TableCell colSpan={8} />
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Popover
                open={Boolean(popoverAnchor)}
                onClose={closePopover}
                sx={{
                    position: 'fixed',
                    top: '60%',
                    left: '60%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Stack sx={{ p: 3, minWidth: 300 }} spacing={2}>
                    <Typography variant="h6" textAlign="center">
                        Are you sure you want to delete this timesheet?
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="outlined" onClick={closePopover}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Popover>
        </>
    );
};

export default TimesheetTable;
