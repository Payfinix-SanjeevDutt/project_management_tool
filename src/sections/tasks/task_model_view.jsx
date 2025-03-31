import React from 'react';

import { Modal, Stack } from '@mui/material';

import Taskview from './taskview';

const TaskModelView = ({ open, onClose, issueKey, isChild , taskname}) => (


        <Modal open={open} onClose={onClose}>
            <Stack
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '82%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    minHeight: '85vh',
                    maxHeight: '100vh',
                }}
            >
                <Taskview handleClose={onClose} issueKey={issueKey} isChild={isChild} taskname={taskname}/>
            </Stack>
        </Modal>
    
);

export default TaskModelView;
