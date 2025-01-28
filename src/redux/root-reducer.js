import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

import tasksReducer from './slices/tasks';
// slices
import stageReducer from './slices/stages';
import projectReducer from './slices/project';
import projectAssigneeReducer from './slices/project_assignee'
// ----------------------------------------------------------------------

export const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: ['projects'],
};

export const rootReducer = combineReducers({
    stages: stageReducer,
    tasks: tasksReducer,
    projects: projectReducer,
    assignee:projectAssigneeReducer,
});
