import {  useNavigate } from 'react-router';
import { useState } from 'react';

import TimerIcon from '@mui/icons-material/Timer';
import {
    Card,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    FormHelperText,
} from '@mui/material';

import { EmptyContent } from 'src/components/empty-content';
import { paths } from 'src/routes/paths';

export default function TimeLogs() {
    const [time] = useState('00:00:00');
    const [project, setProject] = useState('');
    const [job, setJob] = useState('');
    const [description, setDescription] = useState('');
    const [billable, setBillable] = useState('billable');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate

    const handleSubmit = () => {
        navigate(paths.main.timesheet.create) 
    };

    return (
        <div style={{ padding: 24, backgroundColor: '#f3f4f6' }}>
            <div
                style={{
                    backgroundColor: 'white',
                    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                    borderRadius: 8,
                    padding: 16,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                        paddingBottom: 16,
                    }}
                >
                    <h1 style={{ fontSize: 18, fontWeight: 600 }}>Time Logs</h1>
                    <Button variant="contained" onClick={handleSubmit}>
                        Log Time
                    </Button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0' }}>
                    <FormControl style={{ width: 240 }} error={!!errors.project}>
                        <InputLabel>Select Project</InputLabel>
                        <Select value={project} onChange={(e) => setProject(e.target.value)}>
                            <MenuItem value="">Select Project</MenuItem>
                            <MenuItem value="Project A">Project A</MenuItem>
                            <MenuItem value="Project B">Project B</MenuItem>
                        </Select>
                        {errors.project && <FormHelperText>{errors.project}</FormHelperText>}
                    </FormControl>

                    <FormControl style={{ width: 240 }} error={!!errors.job}>
                        <InputLabel>Select Job</InputLabel>
                        <Select value={job} onChange={(e) => setJob(e.target.value)}>
                            <MenuItem value="">Select Job</MenuItem>
                            <MenuItem value="Job A">Job A</MenuItem>
                            <MenuItem value="Job B">Job B</MenuItem>
                        </Select>
                        {errors.job && <FormHelperText>{errors.job}</FormHelperText>}
                    </FormControl>

                    <FormControl style={{ flexGrow: 1 }} error={!!errors.description}>
                        <TextField
                            label="What are you working on?"
                            variant="outlined"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && (
                            <FormHelperText>{errors.description}</FormHelperText>
                        )}
                    </FormControl>

                    <FormControl style={{ width: 240 }} error={!!errors.billable}>
                        <InputLabel>Billable</InputLabel>
                        <Select value={billable} onChange={(e) => setBillable(e.target.value)}>
                            <MenuItem value="billable">Billable</MenuItem>
                            <MenuItem value="non-billable">Non-Billable</MenuItem>
                        </Select>
                        {errors.billable && <FormHelperText>{errors.billable}</FormHelperText>}
                    </FormControl>

                    <div
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TimerIcon style={{ marginRight: 8 }} /> {time}
                    </div>
                </div>

                <Card style={{ marginTop: 16 }}>
                    <EmptyContent
                        title="No Logs"
                        description="No time logs added currently. To add new time logs, click Log Time"
                        sx={{ textAlign: 'center', padding: 20 }}
                    />
                </Card>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        color: '#757575',
                        marginTop: 16,
                        borderTop: '1px solid #e0e0e0',
                        paddingTop: 8,
                    }}
                >
                    <span>00:00 Hrs Total</span>
                    <span>00:00 Hrs Submitted</span>
                    <span>00:00 Hrs Not Submitted</span>
                </div>
            </div>
        </div>
    );
}
