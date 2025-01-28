import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import {
    Box,
    Card,
    Stack,
    Button,
    Dialog,
    Divider,
    Skeleton,
    MenuItem,
    MenuList,
    Typography,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { deleteStage } from 'src/redux/slices/stages';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export function StageDetails() {
    const { id: stage_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [stageDetails, setStageDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const popover = usePopover();

    useEffect(() => {
        const fetchStageDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.post(
                    endpoints.stages.singlelist,
                    { stage_id },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.status && response.data.data) {
                    setStageDetails(response.data.data);
                } else {
                    setStageDetails(null);
                }
            } catch (err) {
                setError('An error occurred while fetching stage details.');
                console.error('Error fetching stage details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (stage_id) {
            fetchStageDetails();
        }
    }, [stage_id]);

    const handleDeleteStage = () => {
        setOpenConfirmDialog(true);
    };

    const confirmDelete = async () => {
        setOpenConfirmDialog(false);
        try {
            await dispatch(deleteStage(stage_id));
            navigate(paths.dashboard.stages.create);
        } catch (err) {
            console.error('Error deleting stage:', err);
        } finally {
            popover.onClose();
        }
    };

    const cancelDelete = () => {
        setOpenConfirmDialog(false);
    };

    const handleEditStage = () => {
        navigate(paths.dashboard.stages.edit(stage_id));
    };

    if (loading || (!stageDetails && !error)) {
        return (
            <Card
                sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Stack spacing={0.5}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                    </Stack>
                    <Skeleton variant="circular" width={40} height={40} />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack
                    spacing={14}
                    direction={{ xs: 'column', sm: 'row' }}
                    divider={<Divider orientation="vertical" flexItem />}
                >
                    {[1, 2, 3, 4].map((index) => (
                        <Box key={index}>
                            <Skeleton variant="text" width={100} />
                            <Skeleton variant="text" width={150} />
                        </Box>
                    ))}
                </Stack>
            </Card>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <>
            <Card
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Stack
                        spacing={0.5}
                        sx={{
                            marginLeft: 2,
                            padding:1 
                        }}
                    >
                        <Typography variant="subtitle1">{stageDetails.stage_name}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {stageDetails.description}
                        </Typography>
                    </Stack>
                    <IconButton onClick={popover.onOpen} color="inherit">
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />
                <Stack
                    spacing={2}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{ width: '100%' }}
                >
                    {[
                        {
                            label: 'Start Date',
                            value: stageDetails.start_date ? (
                                fDate(stageDetails.start_date)
                            ) : (
                                <Typography color="text.secondary">__/__/____</Typography>
                            ),
                        },
                        {
                            label: 'End Date',
                            value: stageDetails.end_date ? (
                                fDate(stageDetails.end_date)
                            ) : (
                                <Typography color="text.secondary">__/__/____</Typography>
                            ),
                        },
                        {
                            label: 'Actual Start Date',
                            value: stageDetails.actual_start_date ? (
                                fDate(stageDetails.actual_start_date)
                            ) : (
                                <Typography color="text.secondary">__/__/____</Typography>
                            ),
                        },
                        {
                            label: 'Actual End Date',
                            value: stageDetails.actual_end_date ? (
                                fDate(stageDetails.actual_end_date)
                            ) : (
                                <Typography color="text.secondary">__/__/____</Typography>
                            ),
                        },
                    ].map((detail, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            <Typography variant="subtitle1" color="text.secondary">
                                {detail.label}
                            </Typography>
                            <Typography variant="subtitle2">{detail.value}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Card>

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
            >
                <MenuList>
                    <MenuItem onClick={handleDeleteStage} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
                        Delete Stage
                    </MenuItem>
                    <MenuItem onClick={handleEditStage}>
                        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
                        Edit Stage
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            <Dialog open={openConfirmDialog} onClose={cancelDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this stage? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
