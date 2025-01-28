import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
    SignInPage: lazy(() => import('src/pages/auth/sign-in')),
    SignUpPage: lazy(() => import('src/pages/auth/sign-up')),
    VerifyPage: lazy(() => import('src/pages/auth/verify')),
    UpdatePasswordPage: lazy(() => import('src/pages/auth/update-password')),
    ResetPasswordPage: lazy(() => import('src/pages/auth/reset-password')),
};

export const authRoutes = [
    {
        path: 'auth',
        element: (
            <Suspense fallback={<SplashScreen />}>
                <Outlet />
            </Suspense>
        ),
        children: [
            {
                path: 'sign-in',
                element: (
                    <GuestGuard>
                        <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
                            <Jwt.SignInPage />
                        </AuthSplitLayout>
                    </GuestGuard>
                ),
            },
            {
                path: 'sign-up',
                element: (
                    <GuestGuard>
                        <AuthSplitLayout>
                            <Jwt.SignUpPage />
                        </AuthSplitLayout>
                    </GuestGuard>
                ),
            },
            {
                path: 'verify',
                element: (
                    <GuestGuard>
                        <AuthSplitLayout>
                            <Jwt.VerifyPage />
                        </AuthSplitLayout>
                    </GuestGuard>
                ),
            },
            {
                path: 'reset-password',
                element: (
                    <GuestGuard>
                        <AuthSplitLayout>
                            <Jwt.ResetPasswordPage />
                        </AuthSplitLayout>
                    </GuestGuard>
                ),
            },
            {
                path: 'update-password',
                element: (
                    <GuestGuard>
                        <AuthSplitLayout>
                            <Jwt.UpdatePasswordPage />
                        </AuthSplitLayout>
                    </GuestGuard>
                ),
            },
        ],
    },
];
