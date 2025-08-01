import React, { useState, useEffect, useCallback } from 'react';
import {
    CircularProgress, Typography, Box, Paper, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Chip, Grid, styled, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput,
    List, ListItem, ListItemText, Divider, Card, CardContent, Avatar, Badge
} from '@mui/material';

import {
    AddCircleOutline as AddCircleOutlineIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    People as PeopleIcon,
    DateRange as DateRangeIcon,
    Description as DescriptionIcon,
    Work as WorkIcon,
    Assignment as AssignmentIcon,
    Settings as SprintIcon,
    Group as GroupIcon,
    Launch as LaunchIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thêm các import cho DatePicker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const API_BASE_URL = 'http://localhost:3000/api';

const Root = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
    },
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(4),
    },
}));

const MainContainer = styled(Paper)(({ theme }) => ({
    maxWidth: '1400px',
    margin: '0 auto',
    borderRadius: '32px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 32px 64px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.3)',
}));

const Header = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(8, 4),
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '32px 32px 0 0',

}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 900,
    fontSize: '3.5rem',
    marginBottom: theme.spacing(2),

    position: 'relative',
    zIndex: 1,
    background: 'linear-gradient(45deg, #ffffff 30%, #f0f2f5 90%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('md')]: {
        fontSize: '2.5rem',
    },
}));

const HeaderSubtitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.3rem',
    opacity: 0.95,
    position: 'relative',
    zIndex: 1,
    fontWeight: 400,
    letterSpacing: '0.5px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '16px',
    padding: '12px 32px',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
    color: '#667eea',
    border: '2px solid rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 1,
    '&:hover': {
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        background: 'linear-gradient(45deg, #ffffff 30%, #ffffff 90%)',
    },
    '&:active': {
        transform: 'translateY(-2px) scale(1.01)',
    },
}));

const CreateButton = styled(StyledButton)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ff6b6b 30%, #ff8e8e 90%)',
    color: 'white',
    border: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #ff5252 30%, #ff7979 90%)',
    },
}));

const ProjectCard = styled(Card)(({ theme }) => ({
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255,255,255,0.8)',
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    paddingBottom:'50px',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        borderRadius: '24px 24px 0 0',
    },
    '&:hover': {
        transform: 'translateY(-12px) scale(1.02)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        '& .project-actions': {
            opacity: 1,
            transform: 'translateY(0)',
        },
        '& .project-title': {
            color: '#667eea',
        },
    },
}));

const ProjectCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    fontSize: '1.4rem',
    color: '#2d3748',
    marginBottom: theme.spacing(1),
    transition: 'color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const ProjectDescription = styled(Typography)(({ theme }) => ({
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: theme.spacing(2),
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
}));

const DateInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(102, 126, 234, 0.1)',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '8px 16px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&.members': {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#16a34a',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            transform: 'translateY(-2px)',
        },
    },
    '&.sprints': {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#dc2626',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            transform: 'translateY(-2px)',
        },
    },
}));

const ProjectActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginTop: 'auto',
    opacity: 0.7,
    transform: 'translateY(8px)',
    transition: 'all 0.3s ease',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    borderRadius: '12px',
    padding: '8px',
    transition: 'all 0.3s ease',
    '&.edit': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            transform: 'scale(1.1)',
        },
    },
    '&.delete': {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            transform: 'scale(1.1)',
        },
    },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 700,
    fontSize: '1.3rem',
    textAlign: 'center',
    margin: 0,
    borderRadius: '24px 24px 0 0',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        "&:hover fieldset": {
            borderColor: "#667eea",
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
        },
        "&.Mui-focused fieldset": {
            borderColor: "#667eea",
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#667eea",
        fontWeight: 600,
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#667eea",
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#667eea",
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#667eea",
        fontWeight: 600,
    },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.8rem',
    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
    color: 'white',
    '&:hover': {
        background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
        transform: 'scale(1.05)',
    },
}));

const EmptyState = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(8),
    background: 'rgba(255,255,255,0.6)',
    borderRadius: '24px',
    margin: theme.spacing(4),
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
}));

const LoadingContainer = styled(Root)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(3),
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
    color: 'white',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
}));

const ProjectsPage = ({ authToken, currentUserId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        teamMembers: [],
    });
    const [loadingCreate, setLoadingCreate] = useState(false);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(false);

    const [openMembersDialog, setOpenMembersDialog] = useState(false);
    const [openSprintsDialog, setOpenSprintsDialog] = useState(false);
    const [openTasksDialog, setOpenTasksDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [users, setUsers] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loadingDropdownData, setLoadingDropdownData] = useState(true);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/projects/all`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Không thể tải dự án.');
            }
            setProjects(data.projects);
        } catch (err) {
            console.error('Lỗi khi tải dự án:', err);
            setError(err.message);
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    const fetchDropdownData = useCallback(async () => {
        setLoadingDropdownData(true);
        try {
            const usersResponse = await fetch(`${API_BASE_URL}/users/all`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const usersData = await usersResponse.json();
            if (!usersResponse.ok) throw new Error(usersData.message || 'Không thể tải danh sách người dùng.');
            setUsers(usersData.users);

            const sprintsResponse = await fetch(`${API_BASE_URL}/sprints/all`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const sprintsData = await sprintsResponse.json();
            if (!sprintsResponse.ok) throw new Error(sprintsData.message || 'Không thể tải danh sách sprints.');
            setSprints(sprintsData.sprints);

            const tasksResponse = await fetch(`${API_BASE_URL}/tasks/all`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const tasksData = await tasksResponse.json();
            if (!tasksResponse.ok) throw new Error(tasksData.message || 'Không thể tải danh sách tasks.');
            setTasks(tasksData.tasks);

        } catch (err) {
            console.error('Lỗi khi tải dữ liệu dropdown:', err);
            toast.error(`Lỗi khi tải dữ liệu: ${err.message}`);
        } finally {
            setLoadingDropdownData(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (authToken) {
            fetchProjects();
            fetchDropdownData();
        }
    }, [authToken, fetchProjects, fetchDropdownData]);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewProject({
            title: '',
            description: '',
            startDate: null,
            endDate: null,
            teamMembers: [],
        });
    };

    const handleNewProjectChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProject = async () => {
        setLoadingCreate(true);
        try {
            if (!newProject.startDate || !newProject.endDate) {
                toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
                setLoadingCreate(false);
                return;
            }
            if (dayjs(newProject.endDate).isBefore(dayjs(newProject.startDate))) {
                toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
                setLoadingCreate(false);
                return;
            }

            const membersToSend = newProject.teamMembers.map(memberId => {
                const user = users.find(u => u._id === memberId);
                return user ? { _id: user._id, name: user.name } : null;
            }).filter(Boolean);

            const response = await fetch(`${API_BASE_URL}/projects/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    ...newProject,
                    teamMembers: membersToSend,
                    startDate: dayjs(newProject.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(newProject.endDate).format('YYYY-MM-DD'),
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Không thể tạo dự án.');
            }
            toast.success('Dự án đã được tạo thành công!');
            handleCloseCreateDialog();
            fetchProjects();
        } catch (err) {
            console.error('Lỗi khi tạo dự án:', err);
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setLoadingCreate(false);
        }
    };

    const handleOpenEditDialog = (project) => {
        setEditProject({
            ...project,
            startDate: project.startDate ? dayjs(project.startDate) : null,
            endDate: project.endDate ? dayjs(project.endDate) : null,
            teamMembers: project.teamMembers ? project.teamMembers.map(member => member._id || member) : [],
            sprintId: project.sprintId ? project.sprintId.map(sprint => sprint._id || sprint) : [],
            tasksId: project.tasksId ? project.tasksId.map(task => task._id || task) : [],
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditProject(null);
    };

    const handleEditProjectChange = (e) => {
        const { name, value } = e.target;
        setEditProject(prev => ({ ...prev, [name]: value }));
    };

    const handleEditMultiSelectChange = (e, fieldName) => {
        const { value } = e.target;
        setEditProject(prev => ({
            ...prev,
            [fieldName]: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Không thể xóa task.');
            }
            toast.success('Task đã được xóa thành công!');
            fetchProjects();
            fetchDropdownData();
        } catch (err) {
            console.error('Lỗi khi xóa task:', err);
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/delete/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Không thể xóa dự án.');
            }
            toast.success('Dự án đã được xóa thành công!');
            fetchProjects();
        } catch (err) {
            console.error('Lỗi khi xóa dự án:', err);
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    const handleUpdateProject = async () => {
        setLoadingEdit(true);
        try {
            if (!editProject || !editProject._id) {
                throw new Error('Không có dự án nào được chọn để chỉnh sửa.');
            }
            if (!editProject.startDate || !editProject.endDate) {
                toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
                setLoadingEdit(false);
                return;
            }
            if (dayjs(editProject.endDate).isBefore(dayjs(editProject.startDate))) {
                toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
                setLoadingEdit(false);
                return;
            }

            const payload = {
                title: editProject.title,
                description: editProject.description,
                startDate: dayjs(editProject.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(editProject.endDate).format('YYYY-MM-DD'),
                teamMembers: editProject.teamMembers,
                sprintId: editProject.sprintId,
                tasksId: editProject.tasksId,
            };

            const response = await fetch(`${API_BASE_URL}/projects/update/${editProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Không thể cập nhật dự án.');
            }
            toast.success('Dự án đã được cập nhật thành công!');
            handleCloseEditDialog();
            fetchProjects();
        } catch (err) {
            console.error('Lỗi khi cập nhật dự án:', err);
            toast.error(`Lỗi: ${err.message}`);
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleOpenMembersDialog = (project) => {
        setSelectedProject(project);
        setOpenMembersDialog(true);
    };

    const handleCloseMembersDialog = () => {
        setOpenMembersDialog(false);
        setSelectedProject(null);
    };

    const handleOpenSprintsDialog = (project) => {
        setSelectedProject(project);
        setOpenSprintsDialog(true);
    };

    const handleCloseSprintsDialog = () => {
        setOpenSprintsDialog(false);
        setSelectedProject(null);
    };

    const handleOpenTasksDialog = (project) => {
        setSelectedProject(project);
        setOpenTasksDialog(true);
    };

    const handleCloseTasksDialog = () => {
        setOpenTasksDialog(false);
        setSelectedProject(null);
    };

    if (loading || loadingDropdownData) {
        return (
            <LoadingContainer>
                <StyledCircularProgress size={60} thickness={4} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    Đang tải dữ liệu...
                </Typography>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <Root sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ p: 4, borderRadius: '24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
                    <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
                        Đã xảy ra lỗi: {error}
                    </Typography>
                    <StyledButton onClick={fetchProjects} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>
                        Thử lại
                    </StyledButton>
                </Paper>
            </Root>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Root>
                <MainContainer>
                    <Header>
                        <HeaderTitle >
                            Quản lý Dự án
                        </HeaderTitle>
                        <HeaderSubtitle>
                            Khám phá và tạo những dự án tuyệt vời của bạn
                        </HeaderSubtitle>
                        <Box sx={{ mt: 4 }}>
                            <CreateButton
                                variant="contained"
                                size="large"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleOpenCreateDialog}
                            >
                                Tạo Dự án Mới
                            </CreateButton>
                        </Box>
                    </Header>
                    
                    <Box sx={{ p: { xs: 3, md: 6 }, py: { xs: 4, md: 8 } }}>
                        {projects.length === 0 ? (
                            <EmptyState>
                                <TrendingUpIcon sx={{ fontSize: '4rem', color: '#667eea', mb: 2 }} />
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
                                    Chưa có dự án nào
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                                    Hãy bắt đầu hành trình của bạn bằng cách tạo dự án đầu tiên!
                                </Typography>
                                <CreateButton
                                    variant="contained"
                                    size="large"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleOpenCreateDialog}
                                >
                                    Tạo Dự án Đầu Tiên
                                </CreateButton>
                            </EmptyState>
                        ) : (
                            <Grid container spacing={4}>
                                {projects.map((project) => (
                                    <Grid item xs={12} sm={6} lg={4} key={project._id}>
                                        <ProjectCard>
                                            <ProjectCardContent>
                                                <Box>
                                                    <ProjectTitle className="project-title">
                                                        <WorkIcon />
                                                        {project.title}
                                                    </ProjectTitle>
                                                    
                                                    <ProjectDescription>
                                                        {project.description || 'Không có mô tả cho dự án này.'}
                                                    </ProjectDescription>
                                                    
                                                    <DateInfo>
                                                        <DateRangeIcon sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            đến
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                                                        </Typography>
                                                    </DateInfo>
                                                    
                                                    <ActionButtons>
                                                        <ActionButton 
                                                            className="members"
                                                            size="small" 
                                                            startIcon={<PeopleIcon />} 
                                                            onClick={() => handleOpenMembersDialog(project)}
                                                        >
                                                            {project.teamMembers?.length || 0} Thành viên
                                                        </ActionButton>
                                                        <ActionButton 
                                                            className="sprints"
                                                            size="small" 
                                                            startIcon={<SprintIcon />} 
                                                            onClick={() => handleOpenSprintsDialog(project)}
                                                        >
                                                            {project.sprintId?.length || 0} Sprints
                                                        </ActionButton>
                                                    </ActionButtons>
                                                </Box>
                                                
                                                <ProjectActions className="project-actions">
                                                    <StyledIconButton 
                                                        className="edit"
                                                        size="small" 
                                                        onClick={() => handleOpenEditDialog(project)}
                                                    >
                                                        <EditIcon />
                                                    </StyledIconButton>
                                                    <StyledIconButton 
                                                        className="delete"
                                                        size="small" 
                                                        onClick={() => handleDeleteProject(project._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </StyledIconButton>
                                                </ProjectActions>
                                            </ProjectCardContent>
                                        </ProjectCard>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </MainContainer>

                {/* Dialog to Create New Project */}
                <StyledDialog open={openCreateDialog} onClose={handleCloseCreateDialog} fullWidth maxWidth="md">
                    <StyledDialogTitle>✨ Tạo Dự án Mới</StyledDialogTitle>
                    <DialogContent sx={{ p: 4, py:10 }}>
                        <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { my: 3 } }}>
                            <StyledTextField
                                fullWidth
                                label="Tên Dự án"
                                name="title"
                                value={newProject.title}
                                onChange={handleNewProjectChange}
                                required
                                placeholder="Nhập tên dự án của bạn..."
                            />
                            <StyledTextField
                                fullWidth
                                label="Mô tả"
                                name="description"
                                multiline
                                rows={4}
                                value={newProject.description}
                                onChange={handleNewProjectChange}
                                placeholder="Mô tả chi tiết về dự án..."
                            />
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Ngày bắt đầu"
                                        value={newProject.startDate}
                                        onChange={(newValue) => setNewProject({ ...newProject, startDate: newValue })}
                                        renderInput={(params) => <StyledTextField {...params} fullWidth required />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Ngày kết thúc"
                                        value={newProject.endDate}
                                        onChange={(newValue) => setNewProject({ ...newProject, endDate: newValue })}
                                        minDate={dayjs(newProject.startDate)}
                                        renderInput={(params) => <StyledTextField {...params} fullWidth required />}
                                    />
                                </Grid>
                            </Grid>
                            <StyledFormControl fullWidth>
                                <InputLabel id="team-members-label">Thành viên nhóm</InputLabel>
                                <Select
                                    labelId="team-members-label"
                                    multiple
                                    value={newProject.teamMembers}
                                    onChange={(e) => handleNewProjectChange({ target: { name: 'teamMembers', value: e.target.value } })}
                                    input={<OutlinedInput label="Thành viên nhóm" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {selected.map((value) => {
                                                const user = users.find(u => u._id === value);
                                                return user ? <StyledChip key={value} label={user.name} size="small" /> : null;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user._id} value={user._id}>
                                            <GroupIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </StyledFormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <StyledButton onClick={handleCloseCreateDialog} variant="outlined">
                            Hủy bỏ
                        </StyledButton>
                        <CreateButton 
                            onClick={handleCreateProject} 
                            variant="contained" 
                            disabled={loadingCreate}
                            startIcon={loadingCreate ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
                        >
                            {loadingCreate ? 'Đang tạo...' : 'Tạo Dự án'}
                        </CreateButton>
                    </DialogActions>
                </StyledDialog>

                {/* Dialog to Edit Project */}
                <StyledDialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="md">
                    <StyledDialogTitle>✏️ Chỉnh sửa Dự án</StyledDialogTitle>
                    <DialogContent sx={{ p: 4 }}>
                        {editProject && (
                            <Box component="form" noValidate autoComplete="off" sx={{ '& > :not(style)': { mb: 3 } }}>
                                <StyledTextField
                                    fullWidth
                                    label="Tên Dự án"
                                    name="title"
                                    value={editProject.title}
                                    onChange={handleEditProjectChange}
                                    required
                                />
                                <StyledTextField
                                    fullWidth
                                    label="Mô tả"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={editProject.description}
                                    onChange={handleEditProjectChange}
                                />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Ngày bắt đầu"
                                            value={editProject.startDate}
                                            onChange={(newValue) => setEditProject({ ...editProject, startDate: newValue })}
                                            renderInput={(params) => <StyledTextField {...params} fullWidth required />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Ngày kết thúc"
                                            value={editProject.endDate}
                                            onChange={(newValue) => setEditProject({ ...editProject, endDate: newValue })}
                                            minDate={dayjs(editProject.startDate)}
                                            renderInput={(params) => <StyledTextField {...params} fullWidth required />}
                                        />
                                    </Grid>
                                </Grid>
                                <StyledFormControl fullWidth>
                                    <InputLabel>Thành viên nhóm</InputLabel>
                                    <Select
                                        multiple
                                        value={editProject.teamMembers}
                                        onChange={(e) => handleEditMultiSelectChange(e, 'teamMembers')}
                                        input={<OutlinedInput label="Thành viên nhóm" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {selected.map((value) => {
                                                    const user = users.find(u => u._id === value);
                                                    return user ? <StyledChip key={value} label={user.name} size="small" /> : null;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user._id} value={user._id}>
                                                <GroupIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                {user.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </StyledFormControl>
                                <StyledFormControl fullWidth>
                                    <InputLabel>Sprints</InputLabel>
                                    <Select
                                        multiple
                                        value={editProject.sprintId}
                                        onChange={(e) => handleEditMultiSelectChange(e, 'sprintId')}
                                        input={<OutlinedInput label="Sprints" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {selected.map((value) => {
                                                    const sprint = sprints.find(s => s._id === value);
                                                    return sprint ? <StyledChip key={value} label={sprint.title} size="small" /> : null;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {sprints.map((sprint) => (
                                            <MenuItem key={sprint._id} value={sprint._id}>
                                                <SprintIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                {sprint.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </StyledFormControl>
                                <StyledFormControl fullWidth>
                                    <InputLabel>Tasks</InputLabel>
                                    <Select
                                        multiple
                                        value={editProject.tasksId}
                                        onChange={(e) => handleEditMultiSelectChange(e, 'tasksId')}
                                        input={<OutlinedInput label="Tasks" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {selected.map((value) => {
                                                    const task = tasks.find(t => t._id === value);
                                                    return task ? <StyledChip key={value} label={task.title} size="small" /> : null;
                                                })}
                                            </Box>
                                        )}
                                    >
                                        {tasks.map((task) => (
                                            <MenuItem key={task._id} value={task._id}>
                                                <AssignmentIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                                                {task.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </StyledFormControl>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <StyledButton onClick={handleCloseEditDialog} variant="outlined">
                            Hủy bỏ
                        </StyledButton>
                        <StyledButton 
                            onClick={handleUpdateProject} 
                            variant="contained" 
                            disabled={loadingEdit}
                            startIcon={loadingEdit ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                            sx={{ 
                                background: 'linear-gradient(45deg, #22c55e 30%, #16a34a 90%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #16a34a 30%, #15803d 90%)',
                                }
                            }}
                        >
                            {loadingEdit ? 'Đang cập nhật...' : 'Cập nhật'}
                        </StyledButton>
                    </DialogActions>
                </StyledDialog>

                {/* Dialog danh sách thành viên */}
                <StyledDialog open={openMembersDialog} onClose={handleCloseMembersDialog} fullWidth maxWidth="sm">
                    <StyledDialogTitle>👥 Danh sách Thành viên</StyledDialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        {selectedProject && selectedProject.teamMembers && selectedProject.teamMembers.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {selectedProject.teamMembers.map((member, index) => {
                                    const user = users.find(u => u._id === (member._id || member));
                                    return user ? (
                                        <React.Fragment key={user._id}>
                                            <ListItem sx={{ py: 2, px: 3 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        mr: 2, 
                                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                                            {user.name}
                                                        </Typography>
                                                    } 
                                                    secondary={
                                                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                            {user.email}
                                                        </Typography>
                                                    } 
                                                />
                                            </ListItem>
                                            {index < selectedProject.teamMembers.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ) : null;
                                })}
                            </List>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <PeopleIcon sx={{ fontSize: '3rem', color: '#667eea', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Chưa có thành viên nào trong dự án này
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <StyledButton onClick={handleCloseMembersDialog} variant="contained">
                            Đóng
                        </StyledButton>
                    </DialogActions>
                </StyledDialog>

                {/* Dialog danh sách Sprints */}
                <StyledDialog open={openSprintsDialog} onClose={handleCloseSprintsDialog} fullWidth maxWidth="sm">
                    <StyledDialogTitle>🚀 Danh sách Sprints</StyledDialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                        {selectedProject && selectedProject.sprintId && selectedProject.sprintId.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {selectedProject.sprintId.map((sprintId, index) => {
                                    const sprint = sprints.find(s => s._id === (sprintId._id || sprintId));
                                    return sprint ? (
                                        <React.Fragment key={sprint._id}>
                                            <ListItem sx={{ py: 2, px: 3 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        mr: 2, 
                                                        background: 'linear-gradient(45deg, #ef4444 30%, #dc2626 90%)',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    <SprintIcon />
                                                </Avatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                                            {sprint.title}
                                                        </Typography>
                                                    } 
                                                    secondary={
                                                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                                                            {new Date(sprint.startDate).toLocaleDateString('vi-VN')} - {new Date(sprint.endDate).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    } 
                                                />
                                            </ListItem>
                                            {index < selectedProject.sprintId.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ) : null;
                                })}
                            </List>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <SprintIcon sx={{ fontSize: '3rem', color: '#ef4444', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    Chưa có sprint nào trong dự án này
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <StyledButton onClick={handleCloseSprintsDialog} variant="contained">
                            Đóng
                        </StyledButton>
                    </DialogActions>
                </StyledDialog>
            </Root>
        </LocalizationProvider>
    );
};

export default ProjectsPage;