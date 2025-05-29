import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { STORAGE_KEY } from 'src/auth/context/constant';
import { setSession } from 'src/auth/context/auth-jwt';


export default function MicrosoftAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkUserSession } = useAuthContext();

    useEffect(() => {
        const token = searchParams.get('token');
        const redirectPath = searchParams.get('redirect') || '/main/dashboard/user-dashboard';

        const proceed = async () => {
            if (token) {
                localStorage.setItem(STORAGE_KEY, token); // OR sessionStorage based on your flow
                setSession(token); // Set axios Authorization
                await checkUserSession(); // Populate user context
                router.push(redirectPath);
            } else {
                router.push('/auth/login');
            }
        };

        proceed();
    }, [router, searchParams, checkUserSession]);

    return null;
}
