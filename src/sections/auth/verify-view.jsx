import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { resendOtp, userVerify } from 'src/auth/context/auth-jwt';

// ----------------------------------------------------------------------

export const VerifySchema = zod.object({
    code: zod
        .string()
        .min(1, { message: 'Code is required!' })
        .min(6, { message: 'Code must be at least 6 characters!' }),
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function AmplifyVerifyView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkUserSession } = useAuthContext();
    const email = searchParams.get('email');
    const { countdown, counting, startCountdown } = useCountdownSeconds(60);
    const defaultValues = { code: '', email: email || '' };
    const [errorMsg, setErrorMsg] = useState('');
    const methods = useForm({
        resolver: zodResolver(VerifySchema),
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
            await userVerify({ email: data.email, otp: data.code });
            await checkUserSession?.();
            router.push(paths.main.project.root);
        } catch (error) {
            console.error(error);
            setErrorMsg(error instanceof Error ? error.message : error);
        }
    });

    const handleResendCode = useCallback(async () => {
        try {
            startCountdown();
            await resendOtp?.({ email: values.email });
        } catch (error) {
            console.error(error);
            setErrorMsg(error instanceof Error ? error.message : error);
        }
    }, [startCountdown, values.email]);

    const renderHead = (
        <>
            <EmailInboxIcon sx={{ mx: 'auto' }} />

            <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center', whiteSpace: 'pre-line' }}>
                <Typography variant="h5">Please check your email!</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
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

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Verify..."
            >
                Verify
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
