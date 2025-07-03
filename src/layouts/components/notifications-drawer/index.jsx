import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

export function NotificationsDrawer({ sx, ...other }) {
  const drawer = useBoolean();
  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.length;
  const { user } = useAuthContext();
  const employeeId = user?.employee_id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!employeeId) return;

      try {
        const res = await axiosInstance.post(endpoints.email_notification.get, {
          employee_id: employeeId,
        });

        if (res.data?.status && Array.isArray(res.data.data)) {
          const sortedNotifications = res.data.data.sort(
            (a, b) => new Date(b.created_time) - new Date(a.created_time)
          );
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

  const handleViewTask = (task_id, link) => {
    if (!task_id) {
      setDialogMessage('This task is deleted.');
      setDialogOpen(true);
    } else {
      navigate(link);
    }
  };

  const deleteNotification = async (notification_id, task_id) => {
    if (task_id) return;

    try {
      const res = await axiosInstance.delete(endpoints.email_notification.delete, {
        data: { notification_id },
      });

      if (res.data?.error_code === 0) {
        setNotifications((prev) => prev.filter((n) => n.notification_id !== notification_id));
        console.log('Notification deleted successfully');
      } else {
        console.error('Failed to delete notification:', res.data.message);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
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
        {notifications.map((notification) => {
          const isDeletable = !notification.task_id;
          return (
            <Box
              key={notification.notification_id}
              sx={{
                borderBottom: '1px solid #ddd',
                p: 2,
                '&:last-child': { borderBottom: 'none' },
                transition: 'background-color 0.3s ease',
                '&:hover': { bgcolor: '#f9f9f9' },
                position: 'relative',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
                  <Avatar
                    alt={notification.employee_name}
                    src={notification.employee_avatar || ''}
                    sx={{ width: 48, height: 48 }}
                  />

                  <Box sx={{ position: 'relative' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      {new Date(notification.created_time).toLocaleString()}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      <strong>{notification.employee_name}</strong>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      You have been assigned to a new task titled <br />
                      <strong>{notification.task_name}</strong>.
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewTask(notification.task_id, notification.link)}
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
                  </Box>
                </Stack>

                <IconButton
                  onClick={() => isDeletable && deleteNotification(notification.notification_id, notification.task_id)}
                  disabled={!isDeletable}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    p: 1,
                    cursor: isDeletable ? 'pointer' : 'not-allowed',
                    opacity: isDeletable ? 1 : 0.5,
                    '&:hover svg': {
                      transform: isDeletable ? 'scale(1.1)' : 'none',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  <SvgIcon>
                    <path
                      fill="#FF5630"
                      d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929z"
                    />
                  </SvgIcon>
                </IconButton>
              </Stack>
            </Box>
          );
        })}
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            minWidth: 360,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {dialogMessage}
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#006400',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
              px: 4,
              py: 1,
              fontWeight: 'bold',
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
