import React, { useState } from 'react';

import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { Iconify } from 'src/components/iconify';

export function TaskViewToolbar() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePrint = () => {
        window.print(); // This opens the print dialog
    };

    const handleShare = () => {
        const shareData = {
            title: 'Check out this Invoice',
            text: 'Here is the invoice I wanted to share with you.',
            url: 'myFile', // Replace with your invoice URL
        };

        // Check if the Web Share API is supported
        if (navigator.share) {
            navigator
                .share(shareData)
                .then(() => {
                    console.log('Share was successful.');
                })
                .catch((error) => {
                    console.error('Error sharing:', error);
                });
        } else {
            // Fallback for browsers that do not support the Web Share API
            copyToClipboard(shareData.url);
        }
    };

    const copyToClipboard = (url) => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log('URL copied to clipboard:', url);
            })
            .catch((err) => {
                console.error('Failed to copy URL: ', err);
            });
    };

    return (
        <ClickAwayListener onClickAway={handleMenuClose}>
            <Stack
                spacing={3}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-end', sm: 'center' }}
                sx={{ mb: { xs: 3, md: 5 } }}
            >
                <Stack direction="row" spacing={1} flexGrow={1} sx={{ width: 1 }}>
                    <Tooltip title="More Options">
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                        style: {
                            display: 'flex',
                            flexDirection: 'row', // Arrange items in a horizontal line
                        },
                    }}
                >
                    <MenuItem
                        onClick={handleMenuClose}
                        style={{
                            fontWeight: 'bold',
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center', // Align items vertically in the center
                            justifyContent: 'flex-start', // Ensure text and icon are next to each other
                            gap: '15px', // Add space between the icon and text
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        <span>Edit</span>
                    </MenuItem>

                    <MenuItem
                        onClick={handleMenuClose}
                        style={{
                            fontWeight: 'bold',
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '15px',
                        }}
                    >
                        <Iconify icon="solar:eye-bold" />
                        <span>View</span>
                    </MenuItem>

                    <MenuItem
                        onClick={handlePrint}
                        style={{
                            fontWeight: 'bold',
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '15px',
                        }}
                    >
                        <Iconify icon="solar:printer-minimalistic-bold" />
                        <span>Print</span>
                    </MenuItem>

                    <MenuItem
                        onClick={handleShare}
                        style={{
                            fontWeight: 'bold',
                            width: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '15px',
                        }}
                    >
                        <Iconify icon="solar:share-bold" />
                        <span>Share</span>
                    </MenuItem>
                </Menu>
            </Stack>
        </ClickAwayListener>
    );
}
