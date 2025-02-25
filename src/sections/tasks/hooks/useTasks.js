import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import {
    setData,
    setTask,
    setSubTask,
    setFilters,
    deleteTaskAction,
    updateTaskAction,
    deleteSubTaskAction,
    updateSubTaskAction,
    deleteAllTasksAction
} from 'src/redux/slices/tasks';

export default function useTasks() {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks);
    const subTasks = useSelector((state) => state.sub_tasks)
    const { project_id } = useParams()
    
    const fetchTasks = async (stage_id) => {
        try {
            const response = await axiosInstance.get(endpoints.tasks.list, {
                params: {
                    project_id,
                    stage_id,
                },
            });

            const { error_code, data } = response.data;

            if (error_code === 0) {
                dispatch(setData(data));
            } else {
                dispatch(setData({tasks:{}, sub_tasks:{}}));
                console.error('Error fetching tasks:', response.data.message);
            }
        } catch (error) {
            dispatch(setData({tasks:{}, sub_tasks:{}}));
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (request) => {
        if (request.task_name) {
            try {
                const response = await axiosInstance.post(endpoints.tasks.create, {
                    task_name: request.task_name,
                    stage_id: request.stage_id,
                    project_id: request.project_id,
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
                    task_name: request.task_name,
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

    const deleteSubTask = async (task_id, parent_id) => {
        try {
            const response = await axiosInstance.delete(endpoints.tasks.delete, {
                data: { task_id },
            });
            const { error_code } = response.data;
            if (error_code === 0) {
                dispatch(deleteSubTaskAction({ task_id, parent_id }));
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

    const updateTask = async (updatedData) => {
        try {
            const response = await axiosInstance.post(endpoints.tasks.update, updatedData);
            const { error_code } = response.data;
            if (error_code === 0) {
                dispatch(updateTaskAction(updatedData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating tasks:', error);
            throw error;
        }
    };

    const updateSubTask = async (updatedData) => {
        try {
            const response = await axiosInstance.post(endpoints.tasks.update, updatedData);
            const { error_code } = response.data;
            if (error_code === 0) {
                dispatch(updateSubTaskAction(updatedData));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating Sub-task:', error);
            throw error;
        }
    };

    return {
        ...tasks,
        ...subTasks,
        deleteTask,
        setFilters,
        fetchTasks,
        createTask,
        deleteSubTask,
        createSubTask,
        deleteAllTasks,
        updateSubTask,
        updateTask
    };
}
