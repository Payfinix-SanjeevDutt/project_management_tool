import { z as zod } from 'zod';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { AuthContext } from 'src/auth/context/auth-context';

export const ChangePassWordSchema = zod
    .object({
        oldPassword: zod
            .string()
            .min(1, { message: 'Password is required!' })
            .min(6, { message: 'Password must be at least 6 characters!' }),
        newPassword: zod.string().min(1, { message: 'New password is required!' }),
        confirmNewPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: 'New password must be different than old password',
        path: ['newPassword'],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'Passwords do not match!',
        path: ['confirmNewPassword'],
    });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
    const password = useBoolean();

    const { user } = useContext(AuthContext);

    const defaultValues = { oldPassword: '', newPassword: '', confirmNewPassword: '' };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(ChangePassWordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        
        try {
            const response = await axiosInstance.post(endpoints.user.security, {
                employee_id:user.employee_id,
                old_password:data.oldPassword,
                new_password:data.newPassword
            });
           
            const { error_code, message } = response.data;
            if (error_code !== 0) {
                throw new Error(message);
            }
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message) ||
                error;
            toast.error(errormsg);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
                <Field.Text
                    name="oldPassword"
                    type={password.value ? 'text' : 'password'}
                    label="Old password"
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

                <Field.Text
                    name="newPassword"
                    label="New password"
                    type={password.value ? 'text' : 'password'}
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
                    helperText={
                        <Stack component="span" direction="row" alignItems="center">
                            <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password
                            must be minimum 6+
                        </Stack>
                    }
                />

                <Field.Text
                    name="confirmNewPassword"
                    type={password.value ? 'text' : 'password'}
                    label="Confirm new password"
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

                <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{ ml: 'auto' }}
                >
                    Save changes
                </LoadingButton>
            </Card>
        </Form>
    );
}
