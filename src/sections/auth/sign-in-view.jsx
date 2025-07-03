import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/auth-jwt';
// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    password: zod
        .string()
        .min(1, { message: 'Password is required!' })
        .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function AmplifySignInView() {
    const router = useRouter();

    const password = useBoolean();

    const [searchParams] = useSearchParams();

    const [errorMsg, setErrorMsg] = useState('');

    const { checkUserSession } = useAuthContext();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            setErrorMsg(decodeURIComponent(error));
        }
    }, [searchParams]);

    const defaultValues = {
        email: '',
        password: '',
    };

    const methods = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signInWithPassword({ email: data.email, password: data.password });
            await checkUserSession?.();
            const redirect = searchParams.get('redirect') || `${paths.main.dashboard.user}`;
            router.push(redirect);
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : error);
        }
    });

    const handleMicrosoftLogin = () => {
        try {
            const platform="web";
            window.location.href = `${import.meta.env.VITE_PROJECT_APP_API}/auth/microsoft-sign-in?platform=${platform}`;
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : error);
        }
    };

    const renderHead = (
        <Stack spacing={1.5} sx={{ mb: 5 }}>
            <Typography variant="h5">Sign in to your account</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`Don't have an account?`}
                </Typography>

                <Link component={RouterLink} href={paths.auth.signUp} variant="subtitle2">
                    Get started
                </Link>
            </Stack>
        </Stack>
    );

    const renderForm = (
        <Stack spacing={3}>
            <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

            <Stack spacing={1.5}>
                <Link
                    component={RouterLink}
                    href={paths.auth.resetPassword}
                    variant="body2"
                    color="inherit"
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Forgot password?
                </Link>

                <Field.Text
                    name="password"
                    label="Password"
                    placeholder="6+ characters"
                    type={password.value ? 'text' : 'password'}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={password.onToggle} edge="end">
                                    <Iconify
                                        icon={
                                            password.value
                                                ? 'solar:eye-bold'
                                                : 'solar:eye-closed-bold'
                                        }
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Sign in..."
            >
                Sign in
            </LoadingButton>

            <LoadingButton
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                startIcon={<Iconify icon="logos:microsoft-icon" width={20} height={20} />}
                onClick={handleMicrosoftLogin}
            >
                Sign In with Office 365
            </LoadingButton>
        </Stack>
    );

    return (
        <>
            {renderHead}

            {!!errorMsg && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMsg}
                </Alert>
            )}

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>
        </>
    );
}
