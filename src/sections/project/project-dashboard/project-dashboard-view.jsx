import { toast } from 'sonner';
import { Tree, TreeNode } from 'react-organizational-chart';
import React, { useState, useEffect, useContext } from 'react';

import {
    Box,
    Grid,
    Card,
    Backdrop,
    Container,
    Typography,
    CardContent,
    CircularProgress,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { AuthContext } from 'src/auth/context/auth-context';

import ComponentBlock from './component-block';

const projectData = [
    {
        id: 1,
        name: 'TrueRead OCR',
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        icon: 'ic:twotone-app-settings-alt',

        stages: [
            {
                name: 'UAT',
                startDate: '2024-01-05',
                endDate: '2024-02-10',
                icon: 'la:project-diagram',
                subStages: [
                    {
                        name: 'Test Trial',
                        startDate: '2024-01-10',
                        endDate: '2024-01-20',
                        icon: 'la:project-diagram',
                    },
                    {
                        name: 'Beta Testing',
                        startDate: '2024-01-25',
                        endDate: '2024-02-05',
                        icon: 'la:project-diagram',
                    },
                ],
            },
            {
                name: 'Estimation',
                startDate: '2024-02-15',
                endDate: '2024-03-05',
                icon: 'la:project-diagram',
                subStages: [
                    {
                        name: 'Test Trial',
                        startDate: '2024-01-10',
                        endDate: '2024-01-20',
                        icon: 'la:project-diagram',
                    },
                    {
                        name: 'Beta Testing',
                        startDate: '2024-01-25',
                        endDate: '2024-02-05',
                        icon: 'la:project-diagram',
                    },
                    {
                        name: 'Test Trial',
                        startDate: '2024-01-10',
                        endDate: '2024-01-20',
                        icon: 'la:project-diagram',
                    },
                    {
                        name: 'Beta Testing',
                        startDate: '2024-01-25',
                        endDate: '2024-02-05',
                        icon: 'la:project-diagram',
                    },
                ],
            },
            {
                name: 'Project Management',
                startDate: '2024-03-10',
                endDate: '2024-04-01',
                icon: 'la:project-diagram',
                subStages: [
                    {
                        name: 'Test Trial',
                        startDate: '2024-01-10',
                        endDate: '2024-01-20',
                        icon: 'la:project-diagram',
                    },
                    {
                        name: 'Beta Testing',
                        startDate: '2024-01-25',
                        endDate: '2024-02-05',
                        icon: 'la:project-diagram',
                    },
                ],
            },
            {
                name: 'Requirements',
                startDate: '2024-04-05',
                endDate: '2024-04-20',
                icon: 'la:project-diagram',
            },
            {
                name: 'Coding & Testing',
                startDate: '2024-04-25',
                endDate: '2024-06-01',
                icon: 'la:project-diagram',
            },
        ],
    },
    {
        id: 2,
        name: 'Crux MDM',
        startDate: '2024-02-01',
        endDate: '2024-07-01',
        icon: 'mdi:shop-settings',
        stages: [
            {
                name: 'Planning',
                startDate: '2024-02-05',
                endDate: '2024-02-20',
                icon: 'la:project-diagram',
            },
            {
                name: 'Execution',
                startDate: '2024-03-01',
                endDate: '2024-04-10',
                icon: 'la:project-diagram',
            },
            {
                name: 'Testing',
                startDate: '2024-04-15',
                endDate: '2024-05-20',
                icon: 'la:project-diagram',
            },
        ],
    },
];

export default function ProjectDashboardView() {
    const settings = useSettingsContext();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedStageIndex, setSelectedStageIndex] = useState(null);
    const { user } = useContext(AuthContext);
    const [projectList, setProjectList] = useState();
    const [stagesList, setStagesList] = useState();
    console.log('projectList>>', projectList);
    console.log('stagesList>>', stagesList);
    //    console.log("project_id>", projectList.id);

    const listresult = async () => {
        try {
            const result = await axiosInstance.post(endpoints.project.list, {
                employee_id: user.employee_id,
            });

            const { error_code, message, data } = result.data;

            if (error_code !== 0) {
                throw new Error(message);
            }
            setProjectList(data);
        } catch (error) {
            const errormsg =
                (error instanceof Error && error.message) ||
                (typeof error === 'object' && error?.message) ||
                error;
            toast.error(errormsg);
        }
    };

    // const handleStageClick = (index) => {
    //     setSelectedStageIndex((prevIndex) => (prevIndex === index ? null : index));
    // };

    useEffect(
        () => {
            if (user?.employee_id) {
                listresult();
            }
        },
        // eslint-disable-next-line
        [user?.employee_id]
    );

    const projectIds = Array.isArray(projectList) ? projectList.map((project) => project.id) : [];
    console.log('projectIds', projectIds);

    const handleListStage = async () => {
        try {
            const result = await axiosInstance.post(endpoints.stages.list, {
                project_id: projectIds,
            });

            const { error_code, message, data } = result.data;
            if (error_code !== 0) {
                throw new Error(message);
            }
            setStagesList(data);
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    useEffect(
        () => {
            if (projectIds) {
                handleListStage();
            }
        },
        // eslint-disable-next-line
        [projectIds]
    );

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Hi, Welcome back 👋
            </Typography>

            <Backdrop sx={{ color: '#fff', zIndex: (themes) => themes.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Box sx={{ p: 3 }}>
                {/* Project Cards */}
                <ComponentBlock title="Office Details" sx={{ overflow: 'auto' }}>
                    <Grid container spacing={3} disableEqualOverflow>
                        {projectData.map((item) => (
                            <Grid item xs={12} sm={6} md={3} key={item.id}>
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        width: '90%',
                                        height: '90%',
                                        pb: 2,
                                        border:
                                            selectedProject?.id === item.id
                                                ? '2px solid rgb(94, 92, 92)'
                                                : 'none',
                                    }}
                                    onClick={() => setSelectedProject(item)}
                                >
                                    <CardContent>
                                        <Iconify
                                            icon={item.icon}
                                            width={50}
                                            height={50}
                                            // style={{ color: 'rgb(124, 123, 124)' }}
                                            style={{ color: '#065c22' }}
                                        />
                                        <Typography variant="h6" sx={{ mt: 1 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ display: 'block', marginTop: 1 }}
                                        >
                                            Start: {item.startDate}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ display: 'block' }}
                                        >
                                            End: {item.endDate}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </ComponentBlock>

                {/* Stage Hierarchy - Tree Structure */}
                {selectedProject && (
                    <Box sx={{ mt: 4, textAlign: 'center', overflow: 'auto' }}>
                        <ComponentBlock title="Office Details" sx={{ pb: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                    p: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minWidth: 'max-content',
                                    }}
                                >
                                    <Tree
                                        lineWidth="2px"
                                        lineHeight="50px"
                                        lineColor="rgb(192, 189, 194)"
                                        lineBorderRadius="10px"
                                        label={
                                            <Card
                                                sx={{
                                                    maxWidth: 200,
                                                    p: 2,
                                                    textAlign: 'center',
                                                    mx: 'auto',
                                                }}
                                            >
                                                <Iconify
                                                    icon={selectedProject.icon}
                                                    width={50}
                                                    height={50}
                                                    style={{ color: '#065c22' }}
                                                />
                                                <Typography variant="h6">
                                                    {selectedProject.name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    sx={{ display: 'block', marginTop: 1 }}
                                                >
                                                    Start: {selectedProject.startDate}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    sx={{ display: 'block' }}
                                                >
                                                    End: {selectedProject.endDate}
                                                </Typography>
                                            </Card>
                                        }
                                    >
                                        {selectedProject.stages.map((stage, index) => (
                                            <TreeNode
                                                key={index}
                                                label={
                                                    <Card
                                                        sx={{
                                                            p: 3,
                                                            textAlign: 'center',
                                                            mx: 'auto',
                                                            my: 'auto',
                                                            mt: 2,
                                                            width: 200,
                                                            cursor: 'pointer',
                                                            border:
                                                                selectedStageIndex === index
                                                                    ? '2px solid rgb(94, 92, 92)' // Only the selected stage gets the border
                                                                    : 'none',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedStageIndex(
                                                                selectedStageIndex === index
                                                                    ? null
                                                                    : index
                                                            ); // Toggle selection on click
                                                        }}
                                                    >
                                                        <Iconify
                                                            icon={stage.icon}
                                                            width={20}
                                                            height={20}
                                                            style={{ color: '#065c22' }}
                                                        />
                                                        <Typography variant="subtitle2">
                                                            {stage.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="textSecondary"
                                                            sx={{ display: 'block', marginTop: 1 }}
                                                        >
                                                            Start: {stage.startDate}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="textSecondary"
                                                            sx={{ display: 'block' }}
                                                        >
                                                            End: {stage.endDate}
                                                        </Typography>
                                                    </Card>
                                                }
                                            />
                                        ))}
                                    </Tree>
                                </Box>
                            </Box>
                        </ComponentBlock>
                    </Box>
                )}

                {/* Stages and Sub-Stages in Tree Format */}
                {selectedProject &&
                    selectedProject.stages?.map(
                        (stage, index) =>
                            selectedStageIndex === index &&
                            stage.subStages?.length > 0 && ( // Only render if subStages exist
                                <Box
                                    key={index}
                                    sx={{
                                        mt: 4,
                                        textAlign: 'center',
                                        overflow: 'auto',
                                    }}
                                >
                                    <ComponentBlock title="Office Details" sx={{ pb: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%',
                                                overflowX: 'auto',
                                                overflowY: 'auto',
                                                p: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    minWidth: 'max-content',
                                                }}
                                            >
                                                <Tree
                                                    lineWidth="2px"
                                                    lineHeight="50px"
                                                    lineColor="rgb(192, 189, 194)"
                                                    lineBorderRadius="10px"
                                                    label={
                                                        <Card
                                                            sx={{
                                                                width: 200,
                                                                p: 2,
                                                                textAlign: 'center',
                                                                mx: 'auto',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() =>
                                                                setSelectedStageIndex(index)
                                                            }
                                                        >
                                                            <Iconify
                                                                icon={stage.icon}
                                                                width={50}
                                                                height={50}
                                                                style={{ color: '#065c22' }}
                                                            />
                                                            <Typography variant="h6">
                                                                {stage.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="textSecondary"
                                                                sx={{
                                                                    display: 'block',
                                                                    marginTop: 1,
                                                                }}
                                                            >
                                                                Start: {stage.startDate}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="textSecondary"
                                                                sx={{ display: 'block' }}
                                                            >
                                                                End: {stage.endDate}
                                                            </Typography>
                                                        </Card>
                                                    }
                                                >
                                                    {stage.subStages.map((subStage, subIndex) => (
                                                        <TreeNode
                                                            key={subIndex}
                                                            label={
                                                                <Card
                                                                    sx={{
                                                                        p: 3,
                                                                        textAlign: 'center',
                                                                        mx: 'auto',
                                                                        my: 'auto',
                                                                        mt: 2,
                                                                        minWidth: 200,
                                                                    }}
                                                                >
                                                                    <Iconify
                                                                        icon={subStage.icon}
                                                                        width={20}
                                                                        height={20}
                                                                        style={{ color: '#065c22' }}
                                                                    />
                                                                    <Typography variant="subtitle2">
                                                                        {subStage.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="textSecondary"
                                                                        sx={{
                                                                            display: 'block',
                                                                            marginTop: 1,
                                                                        }}
                                                                    >
                                                                        Start: {subStage.startDate}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="textSecondary"
                                                                        sx={{ display: 'block' }}
                                                                    >
                                                                        End: {subStage.endDate}
                                                                    </Typography>
                                                                </Card>
                                                            }
                                                        />
                                                    ))}
                                                </Tree>
                                            </Box>
                                        </Box>
                                    </ComponentBlock>
                                </Box>
                            )
                    )}
            </Box>
        </Container>
    );
}
