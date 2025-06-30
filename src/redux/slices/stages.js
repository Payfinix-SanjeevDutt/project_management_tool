import { createSlice } from '@reduxjs/toolkit';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
const initialState = {
    stages: [],
};

const slice = createSlice({
    name: 'stages',
    initialState,
    reducers: {
        setStages(state, action) {
            state.stages = action.payload.map((stage) => ({
                id: stage.stage_id,
                stage_name: stage.stage_name || '',
                description: stage.description || ' ',
                startDate:stage.start_date,
                endDate:stage.end_date,
                actualStartDate:stage.actual_start_date,
                actualEndDate:stage.actual_end_date,
                project_id:stage.project_id,
                path: paths.dashboard.stages.task(stage.project_id,stage.stage_id) || '',
            }));
        },

        setStage(state, action) {
            state.stages.push({
                stage_name: action.payload.stage_name || '',
                path: paths.dashboard.stages.task(action.payload.id) || '',
                id: action.payload.id,
            });
        },

        removeStage(state, action) {
            state.stages = state.stages.filter((it) => it.id !== action.payload.id);
        },

        updateStageInState(state, action) {
            if (!action.payload || !action.payload.id) {
                console.error('Invalid payload in updateStageInState:', action.payload);
                return;
            }

            const index = state.stages.findIndex((stage) => stage.id === action.payload.id);
            if (index !== -1) {
                const updatedStage = {
                    ...state.stages[index],
                    stage_name: action.payload.stage_name,
                };
                state.stages[index] = updatedStage;
            } else {
                console.error('Stage not found for update:', action.payload.id);
            }
        },
    },
});

export default slice.reducer;

export const { setStages, setStage, removeStage, updateStageInState } = slice.actions;

export const fetchStages = (project_id) => async (dispatch) => {
    try {
        const response = await axiosInstance.post(
            endpoints.stages.list,
            {
                project_id,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        const { error, data } = response.data;

        if (error === 0) {
            dispatch(setStages(data));
        } else {
            console.error('Error fetching stages:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching stages:', error);
    }
};

export const deleteStage = (stageId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(endpoints.stages.delete, {
            data: { stage_id: stageId },
        });
        const { error, message } = response.data;

        if (error === 0) {
            dispatch(removeStage({ id: stageId }));
        } else {
            console.error('Error deleting stage:', message);
        }
    } catch (error) {
        console.error('Error deleting stage:', error);
    }
};

export const updateStage = (updatedStage) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(endpoints.stages.update, updatedStage);
        const { error, message, data } = response.data;

        if (error === 0) {
            if (data) {
                dispatch(
                    updateStageInState({
                        id: data.id,
                        stage_name: data.stage_name,
                        description: data.description,
                        startDate: data.start_date,
                        endDate: data.end_date,
                        actualStartDate: data.actual_start_date,
                        actualEndDate: data.actual_end_date,
                    })
                );
            }
        } else {
            console.error('Error updating stage:', message);
        }
    } catch (error) {
        console.error('Error updating stage:', error);
    }
};