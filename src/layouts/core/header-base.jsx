import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import { Menu, Avatar, MenuItem } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { HeaderSection } from './header-section';
import { Searchbar } from '../components/searchbar';
import { MenuButton } from '../components/menu-button';
import { SignInButton } from '../components/sign-in-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { LanguagePopover } from '../components/language-popover';
import { ContactsPopover } from '../components/contacts-popover';
import { NotificationsDrawer } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

const StyledDivider = styled('span')(({ theme }) => ({
    width: 1,
    height: 10,
    flexShrink: 0,
    display: 'none',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
    backgroundColor: 'currentColor',
    color: theme.vars.palette.divider,
    '&::before, &::after': {
        top: -5,
        width: 3,
        height: 3,
        content: '""',
        flexShrink: 0,
        borderRadius: '50%',
        position: 'absolute',
        backgroundColor: 'currentColor',
    },
    '&::after': { bottom: -5, top: 'auto' },
}));

// ----------------------------------------------------------------------

export function HeaderBase({
    sx,
    data,
    slots,
    slotProps,
    onOpenNav,
    layoutQuery,

    slotsDisplay: {
        signIn = true,
        account = true,
        helpLink = true,
        settings = true,
        purchase = true,
        contacts = true,
        searchbar = true,
        workspaces = true,
        menuButton = true,
        localization = true,
        notifications = true,
    } = {},

    ...other
}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const { project_id } = useParams();
    const currentProject =
        data?.workspaces?.find((ws) => ws.id === project_id) || data?.workspaces?.[0];
    return (
        <HeaderSection
            sx={sx}
            layoutQuery={layoutQuery}
            slots={{
                ...slots,
                leftAreaStart: slots?.leftAreaStart,
                leftArea: (
                    <>
                        {slots?.leftAreaStart}

                        {/* -- Menu button -- */}
                        {menuButton && (
                            <MenuButton
                                data-slot="menu-button"
                                onClick={onOpenNav}
                                sx={{
                                    mr: 1,
                                    ml: -1,
                                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                                }}
                            />
                        )}

                        {/* -- Logo -- */}
                        <Logo data-slot="logo" />

                        {/* -- Divider -- */}
                        <StyledDivider data-slot="divider" />

                        {workspaces && data?.workspaces && (
                            <>
                                {/* -- Workspace Dropdown Button -- */}
                                <Button
                                    onClick={handleOpen}
                                    color="inherit"
                                    aria-controls="workspace-menu"
                                    aria-haspopup="true"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                    }}
                                >
                                    <Avatar
                                        src={currentProject?.logo}
                                        alt={currentProject?.name}
                                        sx={{ width: 28, height: 28 }}
                                    />

                                    {currentProject?.name || 'Select Project'}

                                    <ArrowDropDown fontSize="large" />
                                </Button>

                                {/* -- Dropdown Menu -- */}
                                <Menu
                                    id="workspace-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    sx={{ mt: 1 }}
                                >
                                    {data.workspaces.map((workspace) => (
                                        <MenuItem
                                            key={workspace.id}
                                            onClick={() => {
                                                navigate(workspace.path);
                                                handleClose();
                                            }}
                                        >
                                            <img
                                                src={workspace.logo}
                                                alt={workspace.name}
                                                style={{ width: 24, height: 24, marginRight: 8 }}
                                            />
                                            {workspace.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}

                        {slots?.leftAreaEnd}
                    </>
                ),
                rightArea: (
                    <>
                        {slots?.rightAreaStart}

                        <Box
                            data-area="right"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 1, sm: 1.5 },
                            }}
                        >
                            {/* -- Help link -- */}
                            {helpLink && (
                                <Link
                                    data-slot="help-link"
                                    href={paths.faqs}
                                    component={RouterLink}
                                    color="inherit"
                                    sx={{ typography: 'subtitle2' }}
                                >
                                    Need help?
                                </Link>
                            )}

                            {/* -- Searchbar -- */}
                            {searchbar && <Searchbar data-slot="searchbar" data={data?.nav} />}

                            {/* -- Language popover -- */}
                            {localization && (
                                <LanguagePopover data-slot="localization" data={data?.langs} />
                            )}

                            {/* -- Notifications popover -- */}
                            {notifications && (
                                <NotificationsDrawer
                                    data-slot="notifications"
                                    // data={data?.notifications}
                                />
                            )}

                            {/* -- Contacts popover -- */}
                            {contacts && (
                                <ContactsPopover data-slot="contacts" data={data?.contacts} />
                            )}

                            {/* -- Settings button -- */}
                            {settings && <SettingsButton data-slot="settings" />}

                            {/* -- Account drawer -- */}
                            {account && <AccountDrawer data-slot="account" data={data?.account} />}

                            {/* -- Sign in button -- */}
                            {signIn && <SignInButton />}

                            {/* -- Purchase button -- */}
                            {purchase && (
                                <Button
                                    data-slot="purchase"
                                    variant="contained"
                                    rel="noopener"
                                    target="_blank"
                                    href={paths.minimalStore}
                                    sx={{
                                        display: 'none',
                                        [theme.breakpoints.up(layoutQuery)]: {
                                            display: 'inline-flex',
                                        },
                                    }}
                                >
                                    Purchase
                                </Button>
                            )}
                        </Box>

                        {slots?.rightAreaEnd}
                    </>
                ),
            }}
            slotProps={slotProps}
            {...other}
        />
    );
}
