import React from 'react';

import { Box, Card, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

const fileIcons = {
    pdf: {
        icon: 'vscode-icons:file-type-pdf2',
        color: '#ed6767',
    },
    xlsx: {
        icon: 'vscode-icons:file-type-excel',
        color: '#217346',
    },
    docx: {
        icon: 'teenyicons:doc-solid',
        color: '#67caed',
    },
    jpg: {
        icon: 'flat-color-icons:image-file',
    },
    png: {
        icon: 'flat-color-icons:edit-image',
    },
    jpeg: {
        icon: 'flat-color-icons:image-file',
    },
    mp4: {
        icon: 'mdi:video',
    },
    avi: {
        icon: 'mdi:video',
    },
};

const getFileIcon = (fileType) => fileIcons[fileType] || null;

const AttachmentsComponent = ({
    attachedFiles,
    onDownloadFile,
    onDeleteFile,
    trimFileName,
    showAttachedFiles,
    handleDeleteFile,
    handleDownloadFile,
    fileExtension,
}) => (
    <Stack spacing={2} mt={2}>
        <Typography variant="subtitle2">Attachments</Typography>

        {showAttachedFiles.length > 0 || attachedFiles.length > 0 ? (
            <Box
                gap={2} // Controls spacing between items
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)', // Single column on small screens
                    sm: 'repeat(2, 1fr)', // Two columns on medium screens
                    md: 'repeat(4, 1fr)', // Four columns on large screens
                }}
                sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2, // Padding inside the container
                }}
            >
                {/* Render files from `showAttachedFiles` */}
                {showAttachedFiles.map((file, index) => (
                    <Box
                        key={`show-file-${index}`}
                        component={Card}
                        sx={{
                            width: '100%',
                            borderRadius: 0.5,
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover .icon-container': {
                                opacity: 1,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: 120,
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            {file.file_type && getFileIcon(file.file_type) ? (
                                <Iconify
                                    icon={getFileIcon(file.file_type).icon}
                                    width={100}
                                    height={100}
                                    style={{
                                        color: getFileIcon(file.file_type).color || undefined,
                                    }}
                                />
                            ) : null}
                        </Box>
                        <Stack p={1}>
                            <Typography variant="caption">
                                {trimFileName(file.file_name, file.file_type)}
                            </Typography>
                            <Typography variant="caption">21-09-2024</Typography>
                        </Stack>
                        <Box
                            className="icon-container"
                            sx={{
                                p: 1,
                                position: 'absolute',
                                top: 1,
                                right: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Box onClick={() => handleDownloadFile(file.file_name)}>
                                <Iconify
                                    icon="line-md:downloading-loop"
                                    style={{ color: 'black' }}
                                />
                            </Box>
                            <Box onClick={() => handleDeleteFile(file.file_name)}>
                                <Iconify
                                    icon="icon-park-solid:delete-one"
                                    style={{ color: 'black' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                ))}

                {/* Render files from `attachedFiles` */}
                {attachedFiles.map((file, index) => (
                    <Box
                        key={`attached-file-${index}`}
                        component={Card}
                        sx={{
                            width: '100%',
                            borderRadius: 0.5,
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover .icon-container': {
                                opacity: 1,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: 120,
                                backgroundColor: '#f5f5f5',
                            }}
                        >
                            {/* {file.type.startsWith('') ? (
                                <Iconify
                                    icon="vscode-icons:file-type-pdf2"
                                    width={100}
                                    height={100}
                                    style={{ color: '#ed6767' }}
                                />
                            ) : */}
                             {file.name.endsWith('.xlsx')  ? ( 
                                <Iconify
                                    icon="vscode-icons:file-type-excel"
                                    width={100}
                                    height={100}
                                    style={{ color: '#ed6767' }}
                                />
                            ): file.name.endsWith('.docx')  ? ( 
                                <Iconify
                                    icon="teenyicons:doc-solid"
                                    width={100}
                                    height={100}
                                    style={{ color: '#67caed' }}
                                />
                            )
                            : file.type.startsWith('image/') ? (
                                <Iconify
                                    icon="flat-color-icons:edit-image"
                                    width={100}
                                    height={100}
                                />
                            ) : file.type.startsWith('video/') ? (
                                <Box
                                    component="video"
                                    src={URL.createObjectURL(file)}
                                    controls
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            ) : null}
                        </Box>
                        <Stack p={1}>
                            <Typography variant="caption">
                                {file.name} ({file.type.split('/')[1]})
                            </Typography>
                            <Typography variant="caption">21-09-2024</Typography>
                        </Stack>
                        <Box
                            className="icon-container"
                            sx={{
                                p: 1,
                                position: 'absolute',
                                top: 1,
                                right: 1,
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <Box onClick={() => onDownloadFile(file)}>
                                <Iconify
                                    icon="line-md:downloading-loop"
                                    style={{ color: 'black' }}
                                />
                            </Box>
                            <Box onClick={() => onDeleteFile(index)}>
                                <Iconify
                                    icon="icon-park-solid:delete-one"
                                    style={{ color: 'black' }}
                                />
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        ) : (
            <EmptyContent filled title="No Attachments" sx={{ p: 2 }} />
        )}
    </Stack>
);

export default AttachmentsComponent;
