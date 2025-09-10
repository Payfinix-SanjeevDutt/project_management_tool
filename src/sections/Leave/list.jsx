import React, { useState, useEffect } from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';

import { LoadingButton } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import { Search as SearchIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Box,
    Grid,
    Menu,
    Stack,
    Paper,
    Avatar,
    Button,
    Dialog,
    MenuItem,
    TextField,
    Typography,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const ListLeave = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [reason, setReason] = useState('');
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedLeaveHistory, setSelectedLeaveHistory] = useState([]);

    const fetchLeaveHistory = async (employeeId, leaveType) => {
        try {
            const response = await axiosInstance.get(
                `${endpoints.holiday.historyLeave}?employee_id=${employeeId}&leave_type=${leaveType}`
            );
            setSelectedLeaveHistory(response.data || []);
            setHistoryModalOpen(true);
        } catch (error) {
            console.error('Error fetching leave history:', error);
            toast.error('Failed to load leave history');
        }
    };

    const [assignLeaveModalOpen, setAssignLeaveModalOpen] = useState(false);
    const [casualLeave, setCasualLeave] = useState('');
    const [sickLeave, setSickLeave] = useState('');
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSaveSettings = async () => {
        if (!casualLeave || !sickLeave) {
            toast.error('Please enter both Casual and Sick leave values.');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                policies: [
                    { leave_type: 'Casual', default_days: parseInt(casualLeave, 10) },
                    { leave_type: 'Sick', default_days: parseInt(sickLeave, 10) },
                ],
            };
            await axiosInstance.post(endpoints.holiday.createpolicy, payload);
            toast.success('Leave settings saved!');
            setSettingsSaved(true);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleAssignLeaves = async () => {
        try {
            const payload = {
                employee_ids: [selectedEmployee.id],
                casual_leave: casualLeave,
                sick_leave: sickLeave,
            };
            await axiosInstance.post(endpoints.holiday.assignleave, payload);
            toast.success('Leaves assigned successfully!');
            setAssignLeaveModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign leaves');
        }
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRow, setMenuRow] = useState(null);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setMenuRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRow(null);
    };

    const handleUpdate = () => {
        setSelectedEmployee(menuRow);
        setAssignLeaveModalOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        // Your delete logic here, using menuRow.id
        console.log('Delete employee with ID:', menuRow.id);
        handleMenuClose();
    };
    const fetchEmployees = async () => {
        try {
            const response = await axiosInstance.get(endpoints.holiday.listLeave);
            const { data } = response;

            const transformed = Object.entries(data).map(([id, leaves]) => {
                let remainingCasual = 0;
                let remainingSick = 0;

                leaves.forEach((leave) => {
                    const type = leave.leave_type?.toLowerCase();

                    if (type === 'casual') {
                        remainingCasual = leave.balance || 0;
                    } else if (type === 'sick') {
                        remainingSick = leave.balance || 0;
                    }
                });

                return {
                    id,
                    name: leaves[0]?.emp_name || '',
                    avatar: leaves[0]?.emp_avatar || '',
                    remainingCasual,
                    remainingSick,
                    appliedCasual: 18 - remainingCasual,
                    appliedSick: 12 - remainingSick,
                };
            });

            setEmployees(transformed);
        } catch (error) {
            console.error('Error fetching leave balances:', error);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    const columns = [
        {
            field: 'name',
            headerName: 'Employee',
            flex: 1,
            headerAlign: 'center',
            align: 'left',
            renderCell: ({ row }) => (
                <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 3 }}>
                    <Avatar
                        src={row.avatar}
                        sx={{
                            width: 32,
                            height: 32,
                            fontSize: 14,
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                        }}
                    />
                    <Typography fontWeight={500} variant="subtitle1">
                        {row.name}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: 'remainingCasual',
            headerName: 'Remaining Casual',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row, value }) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                        '&:hover .hover-button': {
                            opacity: 1,
                        },
                    }}
                >
                    <Typography color="success.main" fontWeight={500}>
                        {value}
                    </Typography>
                    <IconButton
                        size="small"
                        className="hover-button"
                        sx={{ ml: 1, opacity: 0, transition: 'opacity 0.2s ease-in-out' }}
                        onClick={() => {
                            setSelectedLeaveType('Casual');
                            setSelectedEmployee(row);
                            setOpenModal(true);
                            setDateFrom(null);
                            setDateTo(null);
                            setReason('');
                        }}
                    >
                        <Iconify
                            icon="subway:add"
                            width={16}
                            height={16}
                            style={{ color: '#000' }}
                        />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'remainingSick',
            headerName: 'Remaining Sick',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row, value }) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        width: '100%',
                        '&:hover .hover-button': {
                            opacity: 1,
                        },
                    }}
                >
                    <Typography color="success.main" fontWeight={500}>
                        {value}
                    </Typography>
                    <IconButton
                        size="small"
                        className="hover-button"
                        sx={{ ml: 1, opacity: 0, transition: 'opacity 0.2s ease-in-out' }}
                        onClick={() => {
                            setSelectedLeaveType('Sick');
                            setSelectedEmployee(row);
                            setOpenModal(true);
                            setDateFrom(null);
                            setDateTo(null);
                            setReason('');
                        }}
                    >
                        <Iconify
                            icon="subway:add"
                            width={16}
                            height={16}
                            style={{ color: '#000' }}
                        />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'appliedCasual',
            headerName: 'Applied Casual',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row, value }) => (
                <Typography
                    color="text.primary"
                    fontWeight={500}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        setSelectedEmployee(row);
                        fetchLeaveHistory(row.id, 'Casual');
                    }}
                >
                    {value ?? '-'}
                </Typography>
            ),
        },
        {
            field: 'appliedSick',
            headerName: 'Applied Sick',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row, value }) => (
                <Typography
                    color="text.primary"
                    fontWeight={500}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        setSelectedEmployee(row);
                        fetchLeaveHistory(row.id, 'Sick');
                    }}
                >
                    {value ?? '-'}
                </Typography>
            ),
        },
        {
            field: 'action',
            headerName: 'Actions',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => (
                <>
                    <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <Iconify icon="mdi:dots-vertical" width={20} height={20} />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuRow?.id === row.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        PaperProps={{
                            sx: {
                                minWidth: 140,
                                borderRadius: 2,
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    >
                        <MenuItem onClick={handleUpdate}>
                            <Iconify
                                icon="mdi:update"
                                width={20}
                                height={20}
                                style={{ marginRight: 8, color: 'black' }}
                            />
                            Update
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <Iconify
                                icon="ic:baseline-delete"
                                width={20}
                                height={20}
                                style={{ marginRight: 8, color: '#d32f2f' }}
                            />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            ),
        },
    ];

    const filteredRows = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Box sx={{ px: 10, py: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="medium">
                        Leave Management
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: 240,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: 'background.default',
                            },
                        }}
                    />
                </Stack>

                <Box>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={30}
                        rowsPerPageOptions={[25]}
                        disableSelectionOnClic
                        disableColumnMenu
                        rowHeight={50}
                        headerHeight={70}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            '& .MuiDataGrid-cell': { py: 1 },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'action.hover',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                borderBottom: '1px solid #ccc',
                            },
                            '& .MuiDataGrid-row': { maxHeight: 'none !important' },
                        }}
                    />
                </Box>
            </Box>

            {openModal && (
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle sx={{ pb: 1, py: 4 }}>
                        Apply <b>{selectedLeaveType}</b> Leave
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={3}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Avatar
                                    src={selectedEmployee?.avatar}
                                    alt={selectedEmployee?.name}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        fontWeight: 600,
                                    }}
                                >
                                    {selectedEmployee?.name?.[0]}
                                </Avatar>
                                <Stack>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {selectedEmployee?.name}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <TextField
                                label="Leave Type"
                                fullWidth
                                value={selectedLeaveType}
                                disabled
                                InputProps={{ sx: { fontWeight: 500, color: 'primary.main' } }}
                            />

                            <DatePicker
                                label="From"
                                value={dateFrom}
                                onChange={(newValue) => setDateFrom(newValue)}
                                sx={{ flex: 1 }}
                            />
                            <DatePicker
                                label="To"
                                value={dateTo}
                                onChange={(newValue) => setDateTo(newValue)}
                                sx={{ flex: 1 }}
                            />

                            <TextField
                                label="Reason"
                                fullWidth
                                multiline
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Add any context for the leave (optional)"
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button
                            onClick={() => setOpenModal(false)}
                            variant="outlined"
                            color="inherit"
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type="button"
                            variant="contained"
                            loading={modalLoading}
                            onClick={async () => {
                                setModalLoading(true);
                                try {
                                    const payload = {
                                        employee_id: selectedEmployee.id,
                                        leave_type: selectedLeaveType,
                                        start_date: dateFrom?.format('YYYY-MM-DD'),
                                        end_date: dateTo?.format('YYYY-MM-DD'),
                                        reason,
                                    };

                                    const response = await axiosInstance.post(
                                        endpoints.holiday.applyleave,
                                        payload
                                    );
                                    toast.success(
                                        response.data.message || 'Leave applied successfully'
                                    );
                                    setOpenModal(false);
                                } catch (err) {
                                    console.error(err);
                                    toast.error(err?.response?.data?.error || 'Server error');
                                } finally {
                                    setModalLoading(false);
                                    fetchEmployees();
                                }
                            }}
                        >
                            Submit
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            )}

            {historyModalOpen && selectedEmployee && (
                <Dialog
                    open={historyModalOpen}
                    onClose={() => setHistoryModalOpen(false)}
                    maxWidth="lg"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            height: '500px',
                            maxHeight: '90vh',
                        },
                    }}
                >
                    <DialogTitle sx={{ pb: 1, py: 2 }}>Leave History :</DialogTitle>

                    <DialogContent dividers sx={{ height: '100%' }}>
                        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <Avatar src={selectedEmployee.avatar} sx={{ width: 56, height: 56 }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                {selectedEmployee.name}
                            </Typography>
                        </Stack>

                        <Box sx={{ height: '100%', maxHeight: 420, borderRadius: 3 }}>
                            <DataGrid
                                rows={selectedLeaveHistory.map((item, index) => {
                                    const daysTaken =
                                        differenceInCalendarDays(
                                            parseISO(item.end_date),
                                            parseISO(item.start_date)
                                        ) + 1;

                                    return {
                                        id: index + 1,
                                        start_date: format(
                                            parseISO(item.start_date),
                                            'dd-MMMM-yyyy'
                                        ),
                                        end_date: format(parseISO(item.end_date), 'dd-MMMM-yyyy'),
                                        total_days: daysTaken,
                                        leave_type: item.leave_type,
                                        reason: item.reason || '-',
                                    };
                                })}
                                columns={[
                                    { field: 'id', headerName: '#', width: 70 },
                                    { field: 'reason', headerName: 'Reason', width: 150, flex: 1 },
                                    { field: 'leave_type', headerName: 'Type', width: 130 },
                                    { field: 'start_date', headerName: 'Start Date', width: 150 },
                                    { field: 'end_date', headerName: 'End Date', width: 150 },
                                    { field: 'total_days', headerName: 'Total Days', width: 130 },
                                ]}
                                pageSize={10}
                                rowsPerPageOptions={[5, 10]}
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" onClick={() => setHistoryModalOpen(false)}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {assignLeaveModalOpen && selectedEmployee && (
                <Dialog
                    open={assignLeaveModalOpen}
                    onClose={() => setAssignLeaveModalOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    sx={{ '& .MuiDialog-paper': { maxHeight: '85vh' } }}
                >
                    <DialogTitle sx={{ pb: 1, py: 2 }}>
                        Update Leave - <b>{selectedEmployee.name}</b>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <Avatar src={selectedEmployee.avatar} sx={{ width: 56, height: 56 }} />
                            <Box>
                                <Typography variant="h6">{selectedEmployee.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedEmployee.email}
                                </Typography>
                            </Box>
                        </Stack>

                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Configure Leave Values
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Casual Leave"
                                        type="number"
                                        value={casualLeave}
                                        onChange={(e) => setCasualLeave(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Sick Leave"
                                        type="number"
                                        value={sickLeave}
                                        onChange={(e) => setSickLeave(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveSettings}
                                    size="small"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </Button>
                            </Box>
                        </Paper>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setAssignLeaveModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleAssignLeaves}
                            disabled={!settingsSaved}
                        >
                            Update Leave
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default ListLeave;
