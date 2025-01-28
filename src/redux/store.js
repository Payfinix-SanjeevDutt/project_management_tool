import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import {
    FLUSH,
    PAUSE,
    PURGE,
    PERSIST,
    REGISTER,
    REHYDRATE,
    persistStore,
    persistReducer,
} from 'redux-persist';

import { rootReducer, rootPersistConfig } from './root-reducer';

// ----------------------------------------------------------------------

export const store = configureStore({
    reducer: persistReducer(rootPersistConfig, rootReducer),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export const useSelector = useAppSelector;

export const useDispatch = () => useAppDispatch();
