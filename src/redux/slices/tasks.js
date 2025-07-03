import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------
const initialState = {
    tasks: {},
    subTasks: {},
    order: 'asc',
    orderBy: 'key',
};


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setData(state, action) {
            const { tasks, sub_tasks } = action.payload;
            state.tasks = tasks;
            state.subTasks = sub_tasks;
        },

        setTask(state, action) {
            const { tasks_id, task } = action.payload;
            state.tasks[tasks_id] = {
                ...task,
                children: [],
            };
        },

        setSubTask(state, action) {
            const { tasks_id, subtask_id, subTask } = action.payload;
            if (tasks_id in state.tasks) {
                state.tasks[tasks_id].children.push(subtask_id);
                state.subTasks[subtask_id] = subTask;
            }
        },

        setFilters(state, action) {
            state[action.payload.name] = action.payload.value;
        },

        deleteTaskAction: (state, action) => {
            const children = state.tasks[action.payload].children || [];
            children.forEach((id) => {
                delete state.subTasks[id];
            });
            delete state.tasks[action.payload];
        },

        deleteSubTaskAction: (state, action) => {
            state.tasks[action.payload.parent_id].children = [...state.tasks[
                action.payload.parent_id
            ].children.filter((id) => id !== action.payload.task_id)];
            
            delete state.subTasks[action.payload.task_id];
            
        },

        deleteAllTasksAction(state, action) {
            const task_ids = action.payload || [];
            let children = [];

            task_ids.forEach((it) => {
                children = [...children, ...state.tasks[it].children];
                delete state.tasks[it];
            });

            children.forEach((id) => {
                delete state.subTasks[id];
            });
        },

        updateTaskAction(state, action) {
            state.tasks[action.payload.task_id] = action.payload;
        },

        updateSubTaskAction(state, action) {
            state.subTasks[action.payload.task_id] = action.payload;
        },
    },
});

export default slice.reducer;

export const {
    setData,
    setFilters,
    setTask,
    setSubTask,
    deleteTaskAction,
    deleteAllTasksAction,
    deleteSubTaskAction,
    updateTaskAction,
    updateSubTaskAction,
} = slice.actions;