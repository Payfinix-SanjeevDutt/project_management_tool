import { useDispatch, useSelector } from 'react-redux';

import axiosInstance, { endpoints } from 'src/utils/axios';

import {
    setData,
    setTask,
    setSubTask,
    setFilters,
    deleteTaskAction,
    deleteAllTasksAction,
} from 'src/redux/slices/tasks';

export default function useTasks() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks);

    const fetchTasks = async (stage_id) => {
        try {
            const response = await axiosInstance.get(endpoints.tasks.list, {
                params: {
                    stage_id,
                },
            });

            const { error_code, data } = response.data;

            if (error_code === 0) {
                dispatch(setData(data));
            } else {
                console.error('Error fetching tasks:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (request) => {
        if (request.task_name) {
            try {
                const response = await axiosInstance.post(endpoints.tasks.create, {
                    description: request.task_name,
                    task_name: request.task_name,
                    stage_id: request.stage_id,
                    project_id: request.project_id,
                    sprint_id: request.sprint_id,
                    parent_id: null,
                });
                const { error_code, data, message } = response.data;
                if (error_code !== 0) {
                    throw new Error(message);
                }
                dispatch(setTask({ tasks_id: data.task_id, task: data }));
            } catch (error) {
                const errorMsg =
                    (error instanceof Error && error.message) ||
                    (typeof error === 'object' && error?.message) ||
                    error;
                throw errorMsg;
            }
        }
    };

    const createSubTask = async (request) => {
        if (request.task_name) {
            try {
                const response = await axiosInstance.post(endpoints.tasks.create, {
                    description: request.task_name,
                    stage_id: request.stage_id,
                    project_id: request.project_id,
                    parent_id: request.parent_id,
                });
                const { error_code, data, message } = response.data;
                if (error_code !== 0) {
                    throw new Error(message);
                }
                dispatch(
                    setSubTask({
                        tasks_id: request.parent_id,
                        subTask: data,
                        subtask_id: data.task_id,
                    })
                );
            } catch (error) {
                const errorMsg =
                    (error instanceof Error && error.message) ||
                    (typeof error === 'object' && error?.message) ||
                    error;
                throw errorMsg;
            }
        }
    };

    const deleteTask = async (task_id) => {
        try {
            const response = await axiosInstance.delete(endpoints.tasks.delete, {
                data: { task_id },
            });
            const { error_code } = response.data;
            if (error_code === 0) {
                dispatch(deleteTaskAction(task_id));
                console.log('Task deleted successfully');
            } else {
                console.error('Error deleting task:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const deleteAllTasks = async (task_ids) => {
        try {
            const response = await axiosInstance.delete(endpoints.tasks.deleteall, {
                data: { task_ids },
            });
            const { error_code } = response.data;
            if (error_code === 0) {
                dispatch(deleteAllTasksAction(task_ids));
                console.log('Tasks deleted successfully');
                return true;
            }
            console.error('Error deleting tasks:', response.data.message);
            return false;
        } catch (error) {
            console.error('Error deleting tasks:', error);
            throw error;
        }
    };

    return {
        ...tasks,
        deleteTask,
        setFilters,
        fetchTasks,
        createTask,
        createSubTask,
        deleteAllTasks,
    };
}
