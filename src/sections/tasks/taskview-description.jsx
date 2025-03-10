import { useForm, FormProvider } from 'react-hook-form';

import { Box, Stack, Typography } from '@mui/material';

import { Field } from 'src/components/hook-form';

const DescriptionSection = ({ description, setDescription }) => {
    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <Box mt={3}>
                <Typography variant="subtitle2">Description</Typography>

                <Stack sx={{ mt: 2 }}>
                    <Field.Editor
                        name="description"
                        value={description}
                        onChange={(value) => setDescription({ name: 'description', value })}
                    />
                </Stack>
            </Box>
        </FormProvider>
    );
};

export default DescriptionSection;
