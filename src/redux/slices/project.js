import { createSlice } from '@reduxjs/toolkit';


// ----------------------------------------------------------------------

const initialState = {
    currentProjectId: '',
};

const slice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        getSelectedProject(state) {
            return state;
        },

        setProject(state, action) {
            state.currentProjectId = action.payload.projectId;
        },

        resetSelection(state, action) {
            state.currentProjectId = '';
        },
    },
});

export default slice.reducer;

export const { getSelectedProject, setProject, resetSelection } = slice.actions;
