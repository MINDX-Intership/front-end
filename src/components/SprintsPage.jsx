import React, { useState, useEffect, useCallback } from 'react';
import {
    CircularProgress, Typography, Box, Paper, List, ListItem, ListItemText, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Chip, Grid, styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

const Root = styled(Box)({
    minHeight: '100vh',
    background: 'white',
    padding: '24px',
});

const MainContainer = styled(Paper)({
    maxWidth: '1000px',
    margin: '0 auto',
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
});

const Header = styled(Box)({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '48px 32px',
    textAlign: 'center',
    color: 'white',
});

const HeaderTitle = styled(Typography)({
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

const HeaderSubtitle = styled(Typography)({
    fontSize: '1.2rem',
    opacity: 0.9,
});

const ContentContainer = styled(Box)({
    padding: '32px',
});

const ActionBar = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    gap: '16px',
});

const CreateButton = styled(Button)({
    borderRadius: '12px',
    padding: '12px 32px',
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    background: 'white',
    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'white',
        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
        transform: 'translateY(-2px)',
    },
});

const SprintCard = styled(Paper)({
    margin: '16px 0',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        borderColor: 'rgba(102, 126, 234, 0.2)',
    },
});

const SprintTitle = styled(Typography)({
    fontSize: '1.4rem',
    fontWeight: 700,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
});

const SprintDescription = styled(Typography)({
    color: '#6c757d',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '16px',
});

const DateInfo = styled(Typography)({
    color: '#495057',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '4px',
});

const StyledChip = styled(Chip)(({ status }) => ({
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.85rem',
    height: '32px',
    ...(status === 'Hoàn thành' && {
        background: 'linear-gradient(45deg, #28a745, #20c997)',
        color: 'white',
    }),
    ...(status === 'Đang làm' && {
        background: 'linear-gradient(45deg, #007bff, #6f42c1)',
        color: 'white',
    }),
    ...(status === 'Chưa bắt đầu' && {
        background: 'linear-gradient(45deg, #6c757d, #495057)',
        color: 'white',
    }),
}));

const ActionButtons = styled(Box)({
    display: 'flex',
    gap: '8px',
});

const ActionIconButton = styled(IconButton)(({ color }) => ({
    borderRadius: '10px',
    padding: '8px',
    transition: 'all 0.3s ease',
    ...(color === 'delete' && {
        color: '#dc3545',
        '&:hover': {
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            transform: 'scale(1.1)',
        },
    }),
    ...(color === 'edit' && {
        color: '#667eea',
        '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            transform: 'scale(1.1)',
        },
    }),
}));

const EmptyState = styled(Paper)({
    padding: '64px 32px',
    textAlign: 'center',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
    border: '2px dashed rgba(102, 126, 234, 0.3)',
});

const EmptyStateIcon = styled(Box)({
    fontSize: '4rem',
    marginBottom: '24px',
    opacity: 0.5,
});

const LoadingContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
});

const LoadingContent = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '48px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
});

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        padding: '8px',
    },
});

const DialogButton = styled(Button)(({ variant }) => ({
    borderRadius: '8px',
    padding: '8px 24px',
    fontWeight: 600,
    textTransform: 'none',
    ...(variant === 'delete' && {
        background: 'linear-gradient(45deg, #dc3545, #c82333)',
        color: 'white',
        '&:hover': {
            background: 'linear-gradient(45deg, #c82333, #a71e2a)',
        },
    }),
}));

const SprintsPage = ({ authToken, setCurrentPage, currentUser }) => {
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [sprintToDelete, setSprintToDelete] = useState(null);

    // Function to format date (DD/MM/YYYY)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Function to fetch sprints
    const fetchSprints = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/sprint/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setSprints(data);
            } else {
                setError(data.message || 'Lỗi khi tải danh sách sprint.');
                toast.error(data.message || 'Không thể tải sprint.');
            }
        } catch (err) {
            setError('Lỗi kết nối hoặc lỗi mạng.');
            toast.error('Lỗi kết nối đến máy chủ.');
            console.error('Fetch sprints error:', err);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        if (authToken) {
            fetchSprints();
        } else {
            setLoading(false);
            setError('Không có token xác thực. Vui lòng đăng nhập lại.');
            setCurrentPage('/login');
        }
    }, [authToken, setCurrentPage, fetchSprints]);

    // Handle delete dialog open
    const handleDeleteClick = (sprint) => {
        setSprintToDelete(sprint);
        setOpenDeleteDialog(true);
    };

    // Handle delete dialog close
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSprintToDelete(null);
    };

    // Handle confirm delete action
    const handleConfirmDelete = async () => {
        if (!sprintToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/sprint/delete/${sprintToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                fetchSprints();
            } else {
                toast.error(data.message || 'Lỗi khi xóa sprint.');
            }
        } catch (err) {
            toast.error('Lỗi kết nối khi xóa sprint.');
            console.error('Delete sprint error:', err);
        } finally {
            handleCloseDeleteDialog();
        }
    };

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingContent>
                    <CircularProgress size={48} sx={{ color: '#667eea' }} />
                    <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                        Đang tải sprints...
                    </Typography>
                </LoadingContent>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <LoadingContainer>
                <LoadingContent>
                    <Typography color="error" variant="h6" sx={{ marginBottom: 3 }}>
                        {error}
                    </Typography>
                    <CreateButton onClick={fetchSprints}>
                        Thử lại
                    </CreateButton>
                </LoadingContent>
            </LoadingContainer>
        );
    }

    return (
        <Root>
            <MainContainer elevation={0}>
                <Header>
                    <HeaderTitle variant="h3">
                        Quản lý Sprints
                    </HeaderTitle>
                    <HeaderSubtitle variant="h6">
                        Theo dõi và quản lý các sprint trong dự án của bạn
                    </HeaderSubtitle>
                </Header>

                <ContentContainer>
                    <ActionBar>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Danh sách Sprint ({sprints.length})
                        </Typography>
                        <CreateButton
                            startIcon={<AddIcon />}
                            onClick={() => setCurrentPage('/create-sprint')}
                        >
                            Tạo Sprint Mới
                        </CreateButton>
                    </ActionBar>

                    {sprints.length === 0 ? (
                        <EmptyState elevation={0}>
                            <EmptyStateIcon>📋</EmptyStateIcon>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 600, 
                                marginBottom: 2,
                                color: '#6c757d'
                            }}>
                                Chưa có sprint nào
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#6c757d',
                                marginBottom: 3,
                                fontSize: '1.1rem'
                            }}>
                                Bắt đầu bằng cách tạo sprint đầu tiên cho dự án của bạn
                            </Typography>
                            <CreateButton
                                startIcon={<AddIcon />}
                                onClick={() => setCurrentPage('/create-sprint')}
                            >
                                Tạo Sprint Đầu Tiên
                            </CreateButton>
                        </EmptyState>
                    ) : (
                        <Box>
                            {sprints.map((sprint) => (
                                <SprintCard key={sprint._id} elevation={0}>
                                    <Box sx={{ padding: '24px' }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            marginBottom: '16px'
                                        }}>
                                            <Box sx={{ flex: 1 }}>
                                                <SprintTitle>
                                                    {sprint.title}
                                                </SprintTitle>
                                                <SprintDescription>
                                                    {sprint.description || 'Không có mô tả'}
                                                </SprintDescription>
                                            </Box>
                                            <ActionButtons>

                                                <ActionIconButton 
                                                    color="delete" 
                                                    onClick={() => handleDeleteClick(sprint)}
                                                >
                                                    <DeleteIcon />
                                                </ActionIconButton>
                                            </ActionButtons>
                                        </Box>

                                        <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
                                            <Grid item xs={12} sm={6}>
                                                <DateInfo>
                                                    📅 Bắt đầu: {formatDate(sprint.startDate)}
                                                </DateInfo>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <DateInfo>
                                                    🏁 Kết thúc: {formatDate(sprint.endDate)}
                                                </DateInfo>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <StyledChip
                                                label={sprint.status}
                                                status={sprint.status}
                                                size="medium"
                                            />
                                        </Box>
                                    </Box>
                                </SprintCard>
                            ))}
                        </Box>
                    )}
                </ContentContainer>
            </MainContainer>

            {/* Delete Confirmation Dialog */}
            <StyledDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    fontSize: '1.3rem', 
                    fontWeight: 600,
                    color: '#dc3545'
                }}>
                    ⚠️ Xác nhận xóa Sprint
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontSize: '1.1rem', color: '#495057' }}>
                        Bạn có chắc chắn muốn xóa sprint{' '}
                        <Typography component="span" sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            "{sprintToDelete?.title}"
                        </Typography>
                        {' '}không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        sx={{ 
                            borderRadius: '8px',
                            padding: '8px 24px',
                            fontWeight: 600,
                            textTransform: 'none'
                        }}
                    >
                        Hủy
                    </Button>
                    <DialogButton 
                        variant="delete"
                        onClick={handleConfirmDelete} 
                        autoFocus
                    >
                        Xóa Sprint
                    </DialogButton>
                </DialogActions>
            </StyledDialog>
        </Root>
    );
};

export default SprintsPage;