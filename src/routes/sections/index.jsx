import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/dashboard/analytics/home'));

export function Router() {
    return useRoutes([
        {
            path: '/',
            /**
             * Skip home page
             * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
             */
            element: <Navigate to={CONFIG.auth.redirectPath} replace />,
        },

        ...authRoutes,

        ...dashboardRoutes,

        // No match
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}
