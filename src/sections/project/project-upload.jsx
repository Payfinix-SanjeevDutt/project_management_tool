// import { useFormContext, Controller } from 'react-hook-form';
// import { Stack, Typography, Button, CardMedia, FormHelperText } from '@mui/material';

// export function ImageUpload({ name, multiple, helperText, maxSize, ...other }) {
//   const { control, setValue } = useFormContext();

//   return (
//    <>
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => {
//         const uploadProps = {
//           multiple,
//           accept: { 'image/*': [] },
//           error: !!error,
//           helperText: error?.message ?? helperText,
//         };

//         const onDrop = (acceptedFiles) => {
//           const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];
//           setValue(name, value, { shouldValidate: true });
//         };

//         const handleFileChange = (event) => {
//           const files = event.target.files;
//           if (files.length > 0) {
//             onDrop(Array.from(files));
//           }
//         };

//         return (
//           <Stack spacing={1.5}>
//             <Typography variant="subtitle2">Cover</Typography>
//             <input
//               accept="image/*"
//               type="file"
//               multiple={multiple}
//               onChange={handleFileChange}
//               style={{ display: 'none' }}
//               id={`upload-button-${name}`}
//             />
            
//               <Button variant="contained" component="span">
//                 Upload Image
//               </Button>
           
//             {field.value && (
//               <CardMedia
//                 component="img"
//                 src={URL.createObjectURL(field.value)}
//                 alt="Image Preview"
//                 sx={{ width: '100%', height: 'auto', mt: 1 }}
//               />
//             )}
//             {!!error && (
//               <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
//                 {error.message}
//               </FormHelperText>
//             )}
//           </Stack>
//         );
//       }}
//     </>
//   );
// }



