import { z as zod } from 'zod';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { AuthContext } from 'src/auth/context/auth-context';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    avatar: schemaHelper
        .file({
            message: { required_error: 'Avatar is required!' },
        })
        .nullable(),
    address: zod.string().nullable(),
    employee_id: zod.string().nullable(),
    job_title: zod.string().nullable(),
    organization: zod.string().nullable(),
    department: zod.string().nullable(),
});

export function AccountGeneral() {
    const { user } = useContext(AuthContext);

    const defaultValues = {
        employee_id: user?.employee_id || '',
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || 'Avatar',
        mobile: user?.mobile || '',
        address: user?.address || '',
        job_title: user?.job_title || '',
        organization: user?.organization || '',
        department: user?.department || '',
        created_date: user?.created_date || '',
        verification: user?.verification || '',
        // about: user?.about || '',
    };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(UpdateUserSchema),
        defaultValues,
    });
    // console.log(methods);
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await axiosInstance.post(endpoints.user.account, data);

            const { error_code, message } = response.data;
            toast.success('Update success!');

            if (error_code !== 0) {
                throw new Error(message || 'An error occurred while updating the user.');
            }

            return { status: true, message: 'user updated successfully' };
        } catch (error) {
            console.error('Error during user reset:', error);

            return {
                status: false,
                message: error instanceof Error ? error.message : 'An unknown error occurred',
            };
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card
                        sx={{
                            pt: 10,
                            pb: 5,
                            px: 3,
                            textAlign: 'center',
                        }}
                    >
                        <Field.UploadAvatar
                            name="avatar"
                            maxSize={3145728}
                            helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                        my: 3,
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.disabled',
                                    }}
                                >
                                    Allowed *.jpeg, *.jpg, *.png, *.gif
                                    <br /> max size of {fData(3145728)}
                                </Typography>
                            }
                        />
                        <Typography variant="body2">
                            Joined on {methods.getValues().created_date}
                        </Typography>
                        <Label
                            color={
                                (methods.getValues().verification === 'VERIFIED' && 'success') ||
                                (methods.getValues().verification === 'PENDING' && 'warning') ||
                                'error'
                            }
                            sx={{ position: 'absolute', top: 24, right: 24 }}
                        >
                            {methods.getValues().verification}
                        </Label>
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Field.Text name="name" label="Name" />
                            <Field.Text name="email" label="Email address" />
                            <Field.Phone name="mobile" label="Phone number" country="IN" />

                            <Field.Text name="organization" label="Organization" />
                            <Field.Text name="department" label="Department" />
                            <Field.Text name="job_title" label="Job Title" />
                        </Box>
                        <Field.Text
                            name="address"
                            label="Address"
                            multiline
                            rows={5}
                            sx={{ mt: 3 }}
                        />
                        {/* <Field.Text name="about" multiline rows={4} label="About" /> */}

                        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
