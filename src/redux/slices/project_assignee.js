import { createSlice } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const initialState = {
    employees: {},
};

const slice = createSlice({
    name: 'projects_assignee',
    initialState,
    reducers: {
        setEmployees(state, action) {
            state.employees = action.payload;
        },

        addEmployee(state, action){
            const addedemployees = {};
            action.payload.forEach((user) => {
                addedemployees[user.employee_id] = {
                    access: user.access_status,
                    avatar: user.employee_avatar,
                    id: user.employee_id,
                    mobile:user.mobile,
                    role: user.role,
                    verification:user.verification,
                    name: user.employee_name,
                    email: user.employee_email,
                };
            });

            return {
                employees: {...state.employees, ...addedemployees}
            }

        },

        resetEmployees(state, action) {
            state.employees = {};
        },
    },
});

export default slice.reducer;

export const { setEmployees, resetEmployees , addEmployee} = slice.actions;

export const fetchEmployees = (project_id) => async (dispatch) => {
    try {
        const response = await axiosInstance.post(endpoints.project.project_users, {
            project_id,
        });
        const { data, status } = response.data;
        if (status) {
            const employees = {};
            data.forEach((user) => {
                employees[user.employee_id] = {
                    access: user.access_status,
                    avatar: user.employee_avatar,
                    id: user.employee_id,
                    role: user.role,
                    name: user.employee_name,
                    email: user.employee_email,
                    mobile:user.mobile,
                    verification:user.verification,
                };
            });

            dispatch(setEmployees(employees));
        } else {
            console.error('Unexpected response format', response.data.message);
        }
    } catch (error) {
        console.error('Failed to fetch assignees:', error);
    }
};
