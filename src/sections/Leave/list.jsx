import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Search as SearchIcon } from '@mui/icons-material';
import { Box, Stack, Avatar, TextField, Typography, InputAdornment } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

const ListLeave = () => {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get(endpoints.holiday.listLeave);
                const { data } = response;

                const transformed = Object.entries(data).map(([id, leaves]) => {
                    let remainingCasual = 0;
                    let remainingSick = 0;

                    leaves.forEach((leave) => {
                        if (leave.leave_type.toLowerCase() === 'casual') {
                            remainingCasual = leave.balance;
                        } else if (leave.leave_type.toLowerCase() === 'sick') {
                            remainingSick = leave.balance;
                        }
                    });

                    return {
                        id,
                        name: leaves[0].emp_name,
                        avatar: leaves[0].emp_avatar,
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
                <Stack direction="row" alignItems="center" spacing={1.5}>
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
            renderCell: ({ value }) => (
                <Typography color="success.main" fontWeight={500}>
                    {value}
                </Typography>
            ),
        },
        {
            field: 'remainingSick',
            headerName: 'Remaining Sick',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ value }) => (
                <Typography color="success.main" fontWeight={500}>
                    {value}
                </Typography>
            ),
        },
        {
            field: 'appliedCasual',
            headerName: 'Applied Casual',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ value }) => (
                <Typography color="text.secondary" fontWeight={500}>
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
            renderCell: ({ value }) => (
                <Typography color="text.secondary" fontWeight={500}>
                    {value ?? '-'}
                </Typography>
            ),
        },
    ];

    const filteredRows = employees.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box
            sx={{
                px: 10,
                py: 3,
            }}
        >
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
                    disableSelectionOnClick
                    disableColumnMenu
                    rowHeight={50} // Increase row height
                    headerHeight={70} // Increase header height
                    sx={{
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        '& .MuiDataGrid-cell': {
                            py: 1, // vertical padding inside cells
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'action.hover',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            borderBottom: '1px solid #ccc',
                        },
                        '& .MuiDataGrid-row': {
                            maxHeight: 'none !important',
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ListLeave;
