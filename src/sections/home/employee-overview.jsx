import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// utils
import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function EmployeeOverview() {
    const navigate = useNavigate();
    let empstatus;

    const dummyData = [
        { status: 'Assigned Employee', value: 60 },
        { status: 'UnAssigned Employee', value: 30 },
      ];
    
      // Use dummyData directly or manage it via state
      const [data, setData] = useState(dummyData);

    // const handleNavigate = (status) => {
    //     if (status === 'Employees Approved') {
    //         empstatus = 'Approved';
    //         navigate('/dashboard/team-xcel/employee/list', {
    //             state: { age1, empstatus },
    //         });
    //     } else if (status === 'Pending for Approval') {
    //         empstatus = 'Pending';
    //         navigate('/dashboard/team-xcel/employee/list', {
    //             state: { age1, empstatus },
    //         });
    //     }
    // };
    
    //   const handleProgressUpdate = () => {
    //     setProgress((prev) => ({
    //       value: prev.value + 10, // Increment progress
    //       status: prev.value >= 90 ? 'Success' : prev.status, // Change status on completion
    //     }));
    //   };
    return (
        // <Card {...other}>
        <Card>
            {/* <CardHeader title={title} subheader={subheader} /> */}

            <Stack spacing={3} sx={{ p: 3 }}>
                {data.map((progress) => (
                    <Stack key={progress.status}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1.25 }}
                        >
                            <Box sx={{ typography: 'subtitle2' }}>{progress.status}</Box>
                            <Box sx={{ typography: 'subtitle1' }}>
                                {fShortenNumber(progress.value)}
                            </Box>
                        </Stack>

                        <Box
                            // onClick={() => handleNavigate(prog.status)}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.8 },
                            }}
                        >
                            <LinearProgress
                                variant="determinate"
                                value={progress.value}
                                color={
                                    (progress.status === 'Assigned Employee' && 'success') ||
                                    (progress.status === 'UnAssigned Employee' && 'warning') ||
                                    'success'
                                }
                                sx={{
                                    height: 8,
                                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
                                }}
                            />
                        </Box>
                    </Stack>
                ))}
            </Stack>
        </Card>
    );
}

// EmployeeOverview.propTypes = {
//     data: PropTypes.array,
//     age1: PropTypes.array,
//     age2: PropTypes.array,
//     subheader: PropTypes.string,
//     title: PropTypes.string,
// };
