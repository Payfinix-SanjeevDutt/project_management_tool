import { m } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';
import Avatar from '@mui/material/Avatar';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { Link } from 'react-router-dom';
import { useAuthContext } from 'src/auth/hooks';


// ----------------------------------------------------------------------


export function NotificationsDrawer({ sx, ...other }) {
    const drawer = useBoolean();
    const [notifications, setNotifications] = useState([]);
    const totalUnRead = notifications.length;
    const { user } = useAuthContext();
    const employeeId = user?.employee_id; // This should be dynamically set after login


    // Fetch notifications from backend
    useEffect(() => {
      const fetchNotifications = async () => {
              if (!employeeId) return;

              try {
                  const res = await axiosInstance.post(endpoints.email_notification.get, {
                      employee_id: employeeId
                  });

                  if (res.data?.status && Array.isArray(res.data.data)) {
                      const sortedNotifications = res.data.data.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
                      setNotifications(sortedNotifications);
                  }
              } catch (error) {
                  console.error('Failed to fetch notifications:', error);
              }
          };

          fetchNotifications();
      }, [employeeId]);

    const handleMarkAllAsRead = () => {
        setNotifications([]);
    };

    const renderHead = (
        <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Notifications
            </Typography>

            {!!totalUnRead && (
                <Tooltip title="Mark all as read">
                    <IconButton color="primary" onClick={handleMarkAllAsRead}>
                        <Iconify icon="eva:done-all-fill" />
                    </IconButton>
                </Tooltip>
            )}

            <IconButton
                onClick={drawer.onFalse}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
                <Iconify icon="mingcute:close-line" />
            </IconButton>

            <IconButton>
                <Iconify icon="solar:settings-bold-duotone" />
            </IconButton>
        </Stack>
    );
    const renderList = (
        <Scrollbar sx={{ maxHeight: 'calc(100vh - 160px)' }}>
            <Stack spacing={2} sx={{ px: 2, py: 2 }}>
                {notifications.map((notification) => (
                    <Box
                      key={notification.notification_id}
                      sx={{
                        borderBottom: '1px solid #ddd',
                        p: 2,
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        transition: 'background-color 0.3s ease',
                        '&:hover': {
                          bgcolor: "#f9f9f9"
                        },
                        position: 'relative',
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Centered Avatar */}
                        <Avatar
                          alt={notification.employee_name}
                          src={notification.employee_avatar || ''}
                          sx={{ width: 48, height: 48 }}
                        />

                        {/* Notification Content Section */}
                        <Box sx={{ flexGrow: 1, position: 'relative' }}>
                          {/* Created time at top-right */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                          >
                            {new Date(notification.created_time).toLocaleString()}
                          </Typography>

                          {/* Name */}
                          <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            <strong>{notification.employee_name}</strong>
                          </Typography>

                          {/* Message */}
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            You have been assigned to a new task titled <br />
                            <strong>{notification.task_name}</strong>.
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={notification.link}
                            sx={{
                              mt: 1,
                              color: 'white',
                              backgroundColor: '#006400',
                              borderColor: '#006400',
                              '&:hover': {
                                backgroundColor: 'darkgreen',
                                borderColor: 'darkgreen',
                              },
                            }}
                          >
                            View Task
                          </Button>

                         {/* <Button
                          variant="outlined"
                          size="small"
                          href={notification.link}
                          target="_blank"
                          sx={{
                            mt: 1,
                            color: 'white',
                            backgroundColor: '#006400',
                            borderColor: '#006400',
                            '&:hover': {
                              backgroundColor: 'darkgreen',
                              borderColor: 'darkgreen',
                            },
                          }}
                        >
                          View Task
                        </Button> */}

                        </Box>
                      </Stack>
                    </Box>
                ))}
            </Stack>
        </Scrollbar>
    );

    return (
        <>
            <IconButton
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                onClick={drawer.onTrue}
                sx={sx}
                {...other}
            >
                <Badge badgeContent={totalUnRead} color="error">
                    <SvgIcon>
                        <path
                            fill="currentColor"
                            d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
                            opacity="0.5"
                        />
                        <path
                            fill="currentColor"
                            d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
                        />
                    </SvgIcon>
                </Badge>
            </IconButton>

            <Drawer
                open={drawer.value}
                onClose={drawer.onFalse}
                anchor="right"
                slotProps={{ backdrop: { invisible: true } }}
                PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
            >
                {renderHead}
                {renderList}
            </Drawer>
        </>
    );
}
