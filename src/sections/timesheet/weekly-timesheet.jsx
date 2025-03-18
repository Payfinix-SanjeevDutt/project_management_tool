import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
    Box,
    Table,
    Paper,
    Button,
    Select,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    TextField,
    Typography,
    FormControl,
    TableContainer,
} from "@mui/material";

import { paths } from "src/routes/paths";

const TimeLogTable = () => {
    const [rows, setRows] = useState([1, 2, 3, 4, 5]);
    const [selectedDate, setSelectedDate] = useState(dayjs()); 
    const navigate = useNavigate();

    const handleSubmit = () => navigate(paths.main.timesheet.root);

    const addRow = () => {
        setRows([...rows, rows.length + 1]);
    };

    // Generate weekly date headers based on the selected date
    const getWeekDates = (startDate) => 
         Array.from({ length: 7 }).map((_, i) =>
            dayjs(startDate).add(i, "day").format("MMM DD ddd")
        );
    

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select Start Date"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />
                </LocalizationProvider>
                <Button variant="outlined">Clone</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Job Name</TableCell>
                            <TableCell>Billable Status</TableCell>
                            {getWeekDates(selectedDate).map((day, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        backgroundColor:
                                            index === 0 || index === 6 ? "#fdf2d1" : "transparent",
                                    }}
                                >
                                    {day}
                                </TableCell>
                            ))}
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row}</TableCell>

                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select defaultValue="">
                                            <MenuItem value="">Select Project</MenuItem>
                                            <MenuItem value="Project A">Project A</MenuItem>
                                            <MenuItem value="Project B">Project B</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select defaultValue="">
                                            <MenuItem value="">Select Job</MenuItem>
                                            <MenuItem value="Job A">Job A</MenuItem>
                                            <MenuItem value="Job B">Job B</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>
                                    <FormControl fullWidth>
                                        <Select defaultValue="Billable">
                                            <MenuItem value="Billable">Billable</MenuItem>
                                            <MenuItem value="Non-Billable">Non-Billable</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                {Array.from({ length: 7 }).map((_, i) => (
                                    <TableCell
                                        key={i}
                                        sx={{
                                            backgroundColor:
                                                i === 0 || i === 6 ? "#fdf2d1" : "transparent",
                                        }}
                                    >
                                        <TextField variant="outlined" size="small" defaultValue="00:00" />
                                    </TableCell>
                                ))}

                                <TableCell>00:00</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={2}>
                <Button variant="contained" onClick={addRow}>
                    Add Row
                </Button>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
                p={2}
                bgcolor="#fff"
            >
                <Box>
                    <Typography variant="body2" sx={{ color: "red", display: "inline", mr: 2 }}>
                        Unpaid Leave
                    </Typography>
                    <Typography variant="body2" sx={{ color: "purple", display: "inline", mr: 2 }}>
                        Absent
                    </Typography>
                    <Typography variant="body2" sx={{ color: "blue", display: "inline", mr: 2 }}>
                        Paid Leave
                    </Typography>
                    <Typography variant="body2" sx={{ color: "orange", display: "inline", mr: 2 }}>
                        Weekend
                    </Typography>
                    <Typography variant="body2" sx={{ color: "green", display: "inline", mr: 2 }}>
                        On Duty
                    </Typography>
                    <Typography variant="body2" sx={{ color: "yellow", display: "inline" }}>
                        Holiday
                    </Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button variant="contained" color="primary">
                        Save
                    </Button>
                    <Button variant="outlined">Reset</Button>
                    <Button variant="outlined" onClick={handleSubmit}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default TimeLogTable;
