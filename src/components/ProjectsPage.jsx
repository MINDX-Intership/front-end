import React, { useState, useEffect, useCallback } from 'react';
import {
    CircularProgress, Typography, Box, Paper, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Chip, Grid, styled, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput
} from '@mui/material';
import {
    AddCircleOutline as AddCircleOutlineIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    People as PeopleIcon,
    DateRange as DateRangeIcon,
    Description as DescriptionIcon,
    Work as WorkIcon,
    Assignment as AssignmentIcon,
    Settings as SprintIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = 'http://localhost:3000/api';

const Root = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: theme.spacing(3),
}));

const MainContainer = styled(Paper)(({ theme }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(6, 4),
    textAlign: 'center',
    color: 'white',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    fontSize: '3rem',
    marginBottom: theme.spacing(1),
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    },
}));

const DialogButton = styled(StyledButton)(({ theme, variant }) => ({
    ...(variant === 'delete' && {
        backgroundColor: '#ef4444',
        color: 'white',
        '&:hover': {
            backgroundColor: '#dc2626',
        },
    }),
    ...(variant === 'confirm' && {
        backgroundColor: '#22c55e',
        color: 'white',
        '&:hover': {
            backgroundColor: '#16a34a',
        },
    }),
    ...(variant === 'cancel' && {
        backgroundColor: '#6b7280',
        color: 'white',
        '&:hover': {
            backgroundColor: '#4b5563',
        },
    }),
}));

const ProjectCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
}));

const ProjectsPage = ({ authToken, currentUserId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        teamMembers: [],
    });
    const [loadingCreate, setLoadingCreate] = useState(false);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(false);

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
            startDate: '',
            endDate: '',
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
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
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

    const handleUpdateProject = async () => {
        setLoadingEdit(true);
        try {
            if (!editProject || !editProject._id) {
                throw new Error('Không có dự án nào được chọn để chỉnh sửa.');
            }

            const payload = {
                title: editProject.title,
                description: editProject.description,
                startDate: editProject.startDate,
                endDate: editProject.endDate,
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

    if (loading || loadingDropdownData) {
        return (
            <Root sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu...</Typography>
            </Root>
        );
    }

    if (error) {
        return (
            <Root sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                    Đã xảy ra lỗi: {error}
                </Typography>
                <StyledButton onClick={fetchProjects} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Thử lại
                </StyledButton>
            </Root>
        );
    }

    return (
        <Root>
            <MainContainer>
                <Header>
                    <HeaderTitle variant="h3">
                        Quản lý Dự án
                    </HeaderTitle>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Xem và tạo các dự án của bạn
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <StyledButton
                            variant="contained"
                            color="secondary"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleOpenCreateDialog}
                        >
                            Tạo Dự án Mới
                        </StyledButton>
                    </Box>
                </Header>

                <Box sx={{ p: 4 }}>
                    {projects.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="h6" color="text.secondary">
                                Chưa có dự án nào. Hãy tạo một dự án mới!
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4}>
                            {projects.map((project) => (
                                <Grid item xs={12} sm={6} md={4} key={project._id}>
                                    <ProjectCard>
                                        <Box>
                                            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#667eea' }}>
                                                <WorkIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> {project.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                <DescriptionIcon sx={{ verticalAlign: 'middle', fontSize: '1rem', mr: 0.5 }} /> {project.description || 'Không có mô tả.'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, color: '#764ba2' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Bắt đầu: {new Date(project.startDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <DateRangeIcon sx={{ fontSize: '1rem', mr: 0.5, color: '#764ba2' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    Kết thúc: {new Date(project.endDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                                    <PeopleIcon sx={{ mr: 0.5 }} /> Thành viên nhóm:
                                                </Typography>
                                                {project.teamMembers && project.teamMembers.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {project.teamMembers.map((memberId) => {
                                                            const member = users.find(u => u._id === (memberId._id || memberId));
                                                            return member ? (
                                                                <Chip
                                                                    key={member._id}
                                                                    label={member.name}
                                                                    size="small"
                                                                    sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 500 }}
                                                                />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Chưa có thành viên nào.
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                                    <SprintIcon sx={{ mr: 0.5 }} /> Sprints:
                                                </Typography>
                                                {project.sprintId && project.sprintId.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {project.sprintId.map((sprintId) => {
                                                            const sprint = sprints.find(s => s._id === (sprintId._id || sprintId));
                                                            return sprint ? (
                                                                <Chip
                                                                    key={sprint._id}
                                                                    label={sprint.title}
                                                                    size="small"
                                                                    sx={{ bgcolor: '#e6ffed', color: '#065f46', fontWeight: 500 }}
                                                                />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Chưa có sprint nào.
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                                                    <AssignmentIcon sx={{ mr: 0.5 }} /> Tasks:
                                                </Typography>
                                                {project.tasksId && project.tasksId.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {project.tasksId.map((taskId) => {
                                                            const task = tasks.find(t => t._id === (taskId._id || taskId));
                                                            return task ? (
                                                                <Chip
                                                                    key={task._id}
                                                                    label={task.title}
                                                                    size="small"
                                                                    sx={{ bgcolor: '#ffe6e6', color: '#991b1b', fontWeight: 500 }}
                                                                />
                                                            ) : null;
                                                        })}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Chưa có task nào.
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                            <IconButton color="primary" size="small" aria-label="chỉnh sửa" onClick={() => handleOpenEditDialog(project)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" size="small" aria-label="xóa">
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton color="info" size="small" aria-label="xem chi tiết">
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Box>
                                    </ProjectCard>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </MainContainer>

            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px 24px' }}>
                    Tạo Dự án Mới
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Tên Dự án"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newProject.title}
                        onChange={handleNewProjectChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Mô tả"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={newProject.description}
                        onChange={handleNewProjectChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="startDate"
                        label="Ngày Bắt đầu"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newProject.startDate}
                        onChange={handleNewProjectChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="endDate"
                        label="Ngày Kết thúc"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newProject.endDate}
                        onChange={handleNewProjectChange}
                        sx={{ mb: 2 }}
                        required
                    />
                    {loadingDropdownData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                            <Typography sx={{ ml: 1 }}>Đang tải thành viên...</Typography>
                        </Box>
                    ) : (
                        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                            <InputLabel id="team-members-label">Thành viên nhóm</InputLabel>
                            <Select
                                labelId="team-members-label"
                                id="team-members-select"
                                multiple
                                value={newProject.teamMembers}
                                onChange={(e) => handleNewProjectChange({ target: { name: 'teamMembers', value: e.target.value } })}
                                input={<OutlinedInput label="Thành viên nhóm" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const user = users.find(u => u._id === value);
                                            return user ? <Chip key={value} label={user.name} /> : null;
                                        })}
                                    </Box>
                                )}
                            >
                                {users.map((user) => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.name} ({user.personalEmail})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <StyledButton onClick={handleCloseCreateDialog} variant="outlined" color="secondary">
                        Hủy
                    </StyledButton>
                    <DialogButton
                        variant="confirm"
                        onClick={handleCreateProject}
                        disabled={loadingCreate || !newProject.title || !newProject.startDate || !newProject.endDate}
                        startIcon={loadingCreate ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loadingCreate ? 'Đang tạo...' : 'Tạo Dự án'}
                    </DialogButton>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px 24px' }}>
                    Chỉnh sửa Dự án
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    {editProject && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="title"
                                label="Tên Dự án"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={editProject.title}
                                onChange={handleEditProjectChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label="Mô tả"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={editProject.description}
                                onChange={handleEditProjectChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                name="startDate"
                                label="Ngày Bắt đầu"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={editProject.startDate}
                                onChange={handleEditProjectChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="endDate"
                                label="Ngày Kết thúc"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={editProject.endDate}
                                onChange={handleEditProjectChange}
                                sx={{ mb: 2 }}
                                required
                            />
                            {loadingDropdownData ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                    <CircularProgress size={24} />
                                    <Typography sx={{ ml: 1 }}>Đang tải dữ liệu...</Typography>
                                </Box>
                            ) : (
                                <>
                                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                        <InputLabel id="edit-team-members-label">Thành viên nhóm</InputLabel>
                                        <Select
                                            labelId="edit-team-members-label"
                                            id="edit-team-members-select"
                                            multiple
                                            value={editProject.teamMembers}
                                            onChange={(e) => handleEditMultiSelectChange(e, 'teamMembers')}
                                            input={<OutlinedInput label="Thành viên nhóm" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const user = users.find(u => u._id === value);
                                                        return user ? <Chip key={value} label={user.name} /> : null;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user._id} value={user._id}>
                                                    {user.name} ({user.personalEmail})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                        <InputLabel id="edit-sprints-label">Sprints</InputLabel>
                                        <Select
                                            labelId="edit-sprints-label"
                                            id="edit-sprints-select"
                                            multiple
                                            value={editProject.sprintId}
                                            onChange={(e) => handleEditMultiSelectChange(e, 'sprintId')}
                                            input={<OutlinedInput label="Sprints" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const sprint = sprints.find(s => s._id === value);
                                                        return sprint ? <Chip key={value} label={sprint.title} /> : null;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {sprints.map((sprint) => (
                                                <MenuItem key={sprint._id} value={sprint._id}>
                                                    {sprint.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                                        <InputLabel id="edit-tasks-label">Tasks</InputLabel>
                                        <Select
                                            labelId="edit-tasks-label"
                                            id="edit-tasks-select"
                                            multiple
                                            value={editProject.tasksId}
                                            onChange={(e) => handleEditMultiSelectChange(e, 'tasksId')}
                                            input={<OutlinedInput label="Tasks" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        const task = tasks.find(t => t._id === value);
                                                        return task ? <Chip key={value} label={task.title} /> : null;
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {tasks.map((task) => (
                                                <MenuItem key={task._id} value={task._id}>
                                                    {task.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <StyledButton onClick={handleCloseEditDialog} variant="outlined" color="secondary">
                        Hủy
                    </StyledButton>
                    <DialogButton
                        variant="confirm"
                        onClick={handleUpdateProject}
                        disabled={loadingEdit || !editProject?.title || !editProject?.startDate || !editProject?.endDate}
                        startIcon={loadingEdit ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loadingEdit ? 'Đang cập nhật...' : 'Cập nhật Dự án'}
                    </DialogButton>
                </DialogActions>
            </Dialog>
        </Root>
    );
};

export default ProjectsPage;