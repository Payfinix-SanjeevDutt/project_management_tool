import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const USER_ROLES = [
    { label: 'Admin', value: 'admin' },
    { label: 'Creator', value: 'reporter' },
    { label: 'Assignee', value: 'assignee' },
];
export const NewUserSchema = zod.object({
    avatarUrl: schemaHelper.file({
        message: { required_error: 'Avatar is required!' },
    }),
    name: zod.string().min(1, { message: 'Name is required!' }),
    email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    password: zod.string().min(4, { message: 'password is required with min 4 characters' }),
    // Not required
    address: zod.string(),
    organization: zod.string(),
    department: zod.string(),
    jobTitle: zod.string(),
    status: zod.string(),
    isVerified: zod.boolean(),
    role: zod.array(),
});

// ----------------------------------------------------------------------

export function EmployeeEditForm({ currentUser }) {
    const router = useRouter();

    const defaultValues = useMemo(
        () => ({
            status: currentUser?.status || '',
            avatarUrl: currentUser?.avatarUrl || null,
            isVerified: currentUser?.isVerified || true,
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phoneNumber: currentUser?.phoneNumber || '',
            address: currentUser?.address || '',
            organization: currentUser?.organization || '',
            department: currentUser?.department || '',
            role: currentUser?.role || [],
            jobTitle: currentUser?.jobTitle || '',
            password: currentUser?.password || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        mode: 'onSubmit',
        resolver: zodResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            toast.success(currentUser ? 'Update success!' : 'Create success!');
            // router.push(paths.dashboard.user.list);
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        {currentUser && (
                            <Label
                                color={
                                    (values.status === 'active' && 'success') ||
                                    (values.status === 'banned' && 'error') ||
                                    'warning'
                                }
                                sx={{ position: 'absolute', top: 24, right: 24 }}
                            >
                                {values.status}
                            </Label>
                        )}

                        <Box sx={{ mb: 5 }}>
                            <Field.UploadAvatar
                                name="avatarUrl"
                                maxSize={3145728}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
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
                        </Box>

                        {currentUser && (
                            <FormControlLabel
                                labelPlacement="start"
                                control={
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                {...field}
                                                checked={field.value !== 'active'}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        event.target.checked ? 'banned' : 'active'
                                                    )
                                                }
                                            />
                                        )}
                                    />
                                }
                                label={
                                    <>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Banned
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Apply disable account
                                        </Typography>
                                    </>
                                }
                                sx={{
                                    mx: 0,
                                    mb: 3,
                                    width: 1,
                                    justifyContent: 'space-between',
                                }}
                            />
                        )}

                        <Field.Switch
                            name="isVerified"
                            labelPlacement="start"
                            label={
                                <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                        Active Employee
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Disabling this will makes employee profile inactive and
                                        cannot associate with projects, stages and tasks..
                                    </Typography>
                                </>
                            }
                            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                        />

                        {currentUser && (
                            <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                                <Button variant="soft" color="error">
                                    Delete user
                                </Button>
                            </Stack>
                        )}
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
                            <Field.Text name="name" label="Full name" />
                            <Field.Text name="email" label="Email address" />
                            <Field.Phone name="phoneNumber" label="Phone number" />
                            <Field.Text name="jobTitle" label="Job Title" />
                            <Field.Text name="organization" label="Organization" />
                            <Field.Text name="department" label="Department" />
                            <Field.MultiSelect
                                name="role"
                                label="Role"
                                options={USER_ROLES}
                                chip
                                slotProps={{ chip: { color: 'success' } }}
                            />
                            <Field.Text name="password" label="Password" />
                        </Box>

                        <Field.Text
                            name="address"
                            label="Address"
                            multiline
                            rows={5}
                            sx={{ mt: 3 }}
                        />

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Create user' : 'Save changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    );
}
