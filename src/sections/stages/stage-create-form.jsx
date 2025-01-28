import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { Card, Stack, Divider, TextField, CardHeader, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { setStage, updateStage, fetchStages } from 'src/redux/slices/stages';

import { toast } from 'src/components/snackbar';

const STATE = {
    stageName: '',
    description: '',
    startDate: dayjs(),
    endDate: dayjs(),
    actualStartDate: null,
    actualEndDate: null,
    stageId: null,
};

export default function StageCreateForm() {
    const [formData, setFormData] = useState(STATE);
    const { currentProjectId: project_id } = useSelector((state) => state.projects);
    const loading = useBoolean();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projectId,id } = useParams();

    const stages = useSelector((state) => state.stages.stages);

    const stageToEdit = id ? stages.find((stage) => stage.id === id) : null;

    useEffect(() => {
        if (id) {
            if (stageToEdit) {
                setFormData({
                    stageId: stageToEdit.id,
                    project_id: stageToEdit.project_id,
                    stageName: stageToEdit.stage_name,
                    description: stageToEdit.description,
                    startDate: stageToEdit.startDate ? dayjs(stageToEdit.startDate) : null,
                    endDate: stageToEdit.endDate ? dayjs(stageToEdit.endDate) : dayjs(),
                    actualStartDate: stageToEdit.actualStartDate
                        ? dayjs(stageToEdit.actualStartDate)
                        : null,
                    actualEndDate: stageToEdit.actualEndDate
                        ? dayjs(stageToEdit.actualEndDate)
                        : null,
                });
            }
        }
    }, [id, stageToEdit]);

    const handleFormData = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleCreateStage = async () => {
        loading.onTrue();

        const dataToSend = {
            stage_name: formData.stageName,
            description: formData.description,
            project_id,
            start_date: formData.startDate.format('YYYY-MM-DD'),
            end_date: formData.endDate.format('YYYY-MM-DD'),
            actual_start_date: formData.actualStartDate
                ? formData.actualStartDate.format('YYYY-MM-DD')
                : null,
            actual_end_date: formData.actualEndDate
                ? formData.actualEndDate.format('YYYY-MM-DD')
                : null,
        };

        try {
            const response = await axiosInstance.post(endpoints.stages.create, dataToSend);

            const { message, error, data } = response.data;

            if (error === 0) {
                dispatch(setStage({ stage_name: data.stage_name, id: data.stage_id }));
                toast.success('Stage created successfully!');
                navigate(paths.dashboard.stages.task(data.stage_id));
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to create stage');
        } finally {
            loading.onFalse();
        }
    };

    const handleUpdateStage = async () => {
        loading.onTrue();

        const dataToSend = {
            stage_id: formData.stageId,
            name: formData.stageName,
            description: formData.description,
            project_id,
            start_date: formData.startDate.format('YYYY-MM-DD'),
            end_date: formData.endDate.format('YYYY-MM-DD'),
            actual_start_date: formData.actualStartDate
                ? formData.actualStartDate.format('YYYY-MM-DD')
                : null,
            actual_end_date: formData.actualEndDate
                ? formData.actualEndDate.format('YYYY-MM-DD')
                : null,
        };

        try {
            const response = await axiosInstance.put(endpoints.stages.update, dataToSend);

            const { message, error } = response.data;

            if (error === 0) {
                dispatch(
                    updateStage({
                        id: formData.stageId,
                        stage_name: formData.stageName,
                    })
                );

                dispatch(fetchStages(projectId));

                toast.success('Stage updated successfully!');
                navigate(paths.dashboard.stages.task(formData.stageId));
            } else {
                toast.error(message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to process');
        } finally {
            loading.onFalse();
        }
    };

    const handleSubmit = async () => {
        if (formData.stageId) {
            await handleUpdateStage();
        } else {
            await handleCreateStage();
        }
    };

    return (
        <Card sx={{ mx: 'auto', width: '80%' }}>
            <CardHeader
                title={id ? 'Edit Stage' : 'Create Stage'}
                subheader="Title, short description, dates ..."
                sx={{ mb: 3 }}
            />
            <Divider />
            <CardContent>
                <Stack gap={4}>
                    <TextField
                        fullWidth
                        name="stageName"
                        label="Stage Name"
                        variant="outlined"
                        value={formData.stageName}
                        onChange={handleFormData}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={formData.description}
                        onChange={handleFormData}
                    />
                    <Stack direction="row" gap={2}>
                        <DatePicker
                            label="Start Date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={(newValue) => handleDateChange('startDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                        <DatePicker
                            label="End Date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(newValue) => handleDateChange('endDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                    </Stack>

                    <Stack direction="row" gap={2}>
                        <DatePicker
                            label="Actual Start Date"
                            name="actualstartdate"
                            value={formData.actualStartDate}
                            onChange={(newValue) => handleDateChange('actualStartDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                        <DatePicker
                            label="Actual End Date"
                            name="actualenddate"
                            value={formData.actualEndDate}
                            onChange={(newValue) => handleDateChange('actualEndDate', newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps?.endAdornment,
                                    }}
                                />
                            )}
                            sx={{ flexGrow: 1 }}
                        />
                    </Stack>

                    <LoadingButton
                        variant="contained"
                        onClick={handleSubmit}
                        size="medium"
                        sx={{
                            alignSelf: 'flex-end',
                        }}
                        loading={loading.value}
                    >
                        {id ? 'Update Stage' : 'Save Stage'}
                    </LoadingButton>
                </Stack>
            </CardContent>
        </Card>
    );
}
