import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { resendOtp, updatePassword } from 'src/auth/context/auth-jwt';

export const UpdatePasswordSchema = zod
    .object({
        code: zod
            .string()
            .min(1, { message: 'Code is required!' })
            .min(6, { message: 'Code must be at least 6 characters!' }),
        email: zod
            .string()
            .min(1, { message: 'Email is required!' })
            .email({ message: 'Email must be a valid email address!' }),
        password: zod
            .string()
            .min(1, { message: 'Password is required!' })
            .min(6, { message: 'Password must be at least 6 characters!' }),
        confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match!',
        path: ['confirmPassword'],
    });

// ----------------------------------------------------------------------

export function AmplifyUpdatePasswordView() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get('email');

    const password = useBoolean();

    const { countdown, counting, startCountdown } = useCountdownSeconds(60);

    const defaultValues = {
        code: '',
        email: email || '',
        password: '',
        confirmPassword: '',
    };

    const methods = useForm({
        resolver: zodResolver(UpdatePasswordSchema),
        defaultValues,
    });

    const {
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updatePassword({
                email: data.email,
                otp: data.code,
                password: data.password,
            });

            router.push(paths.auth.signIn);
        } catch (error) {
            console.error(error);
        }
    });

    const handleResendCode = useCallback(async () => {
        try {
            startCountdown();
            await resendOtp({ email: values.email});
        } catch (error) {
            console.error(error);
        }
    }, [startCountdown, values.email]);

    const renderHead = (
        <>
            <SentIcon sx={{ mx: 'auto' }} />

            <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
                <Typography variant="h5">Request sent successfully!</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`We've sent a 6-digit confirmation email to your email. \nPlease enter the code in below box to verify your email.`}
                </Typography>
            </Stack>
        </>
    );

    const renderForm = (
        <Stack spacing={3}>
            <Field.Text
                name="email"
                label="Email address"
                placeholder="example@gmail.com"
                InputLabelProps={{ shrink: true }}
                disabled
            />

            <Field.Code name="code" />

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
                                        password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                    }
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Field.Text
                name="confirmPassword"
                label="Confirm new password"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                                <Iconify
                                    icon={
                                        password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                    }
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Update password..."
            >
                Update password
            </LoadingButton>

            <Typography variant="body2" sx={{ mx: 'auto' }}>
                {`Don’t have a code? `}
                <Link
                    variant="subtitle2"
                    onClick={handleResendCode}
                    sx={{
                        cursor: 'pointer',
                        ...(counting && { color: 'text.disabled', pointerEvents: 'none' }),
                    }}
                >
                    Resend code {counting && `(${countdown}s)`}
                </Link>
            </Typography>

            <Link
                component={RouterLink}
                href={paths.auth.signIn}
                color="inherit"
                variant="subtitle2"
                sx={{ gap: 0.5, alignSelf: 'center', alignItems: 'center', display: 'inline-flex' }}
            >
                <Iconify width={16} icon="eva:arrow-ios-back-fill" />
                Return to sign in
            </Link>
        </Stack>
    );

    return (
        <>
            {renderHead}

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>
        </>
    );
}
