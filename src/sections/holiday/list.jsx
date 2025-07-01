import dayjs from 'dayjs';
import { toast } from 'sonner';
import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Box,
    Grid,
    Menu,
    Paper,
    Button,
    Dialog,
    MenuItem,
    Typography,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
    CircularProgress,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

const HolidayTable = () => {
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedId, SelectedRowId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchHolidays = async () => {
        try {
            const response = await axiosInstance.get(endpoints.holiday.list);
            if (response.data.status) {
                setHolidays(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Failed to fetch holidays:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleSelectionModelChange = (ids) => {
        setSelectedIds(ids);
    };
    const columns = [
        { field: 'holiday_name', headerName: 'Name', flex: 1 },
        { field: 'start_date', headerName: 'Start Date', flex: 1 },
        { field: 'end_date', headerName: 'End Date', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'is_optional', headerName: 'Optional', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => (
                <IconButton size="small" onClick={(event) => handleMenuClick(event, params.row.id)}>
                    <MoreVertIcon sx={{ fontSize: 20 }} />
                </IconButton>
            ),
        },
    ];

    const rows = holidays.map((h) => ({
        id: h.holiday_id,
        holiday_name: h.holiday_name,
        start_date: dayjs(h.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(h.end_date).format('YYYY-MM-DD'),
        type: h.type,
        is_optional: h.is_optional === 'True' ? 'Yes' : 'No',
    }));

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        SelectedRowId(id);
        // console.log(row.id)
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
        handleMenuClose(); // close the menu
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await axiosInstance.post(endpoints.holiday.delete, {
                holiday_id: selectedId,
            });
            if (response.status === 200) {
                toast.success('Holiday deleted successfully');
                fetchHolidays();
            }
            // Optionally refresh the table or update local state
        } catch (error) {
            toast.error('Failed to delete holiday');
            console.error(error);
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            const response = await axiosInstance.post(endpoints.holiday.deleteall, {
                holiday_ids: selectedIds,
            });

            if (response.data.status) {
                toast.success(`${selectedIds.length} holiday(s) deleted successfully`);
                setSelectedIds([]); // reset selection
                fetchHolidays(); // refresh list
            } else {
                toast.error(response.data.message || 'Bulk deletion failed');
            }
        } catch (error) {
            console.error('Bulk deletion error:', error);
            toast.error('Something went wrong while deleting holidays.');
        }
    };

    return (
        <>
            <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} md={10}>
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            📅 Holiday List
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center" p={3}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={{ height: 600, mt: 3 }}>
                                {selectedIds.length > 0 && (
                                    <Box display="flex" justifyContent="flex-end" mb={2}>
                                        <Button variant="contained" onClick={handleBulkDelete}>
                                            Delete Selected
                                        </Button>
                                    </Box>
                                )}

                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    onRowSelectionModelChange={handleSelectionModelChange}
                                    rowSelectionModel={selectedIds}
                                />
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={isDeleteModalOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete?</DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HolidayTable;
