import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
    const { state, setState } = useSetState({
        user: null,
        loading: true,
    });

    const checkUserSession = useCallback(async () => {
        try {
            const accessToken = sessionStorage.getItem(STORAGE_KEY);

            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);

                const res = await axiosInstance.get(endpoints.auth.me);
                const { error_code, data } = res.data;

                if (error_code === 0) {
                    setState({ user: { ...data, accessToken }, loading: false });
                } else {
                    setState({ user: null, loading: false });
                }
            } else {
                setState({ user: null, loading: false });
            }
        } catch (error) {
            console.error(error);
            setState({ user: null, loading: false });
        }
    }, [setState]);

    useEffect(() => {
        checkUserSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ----------------------------------------------------------------------

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
            user: state.user
                ? {
                      ...state.user,
                      role: state.user?.role ?? 'admin',
                  }
                : null,
            checkUserSession,
            loading: status === 'loading',
            authenticated: status === 'authenticated',
            unauthenticated: status === 'unauthenticated',
        }),
        [checkUserSession, state.user, status]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
