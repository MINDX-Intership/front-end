import React, { useState, useEffect, useCallback } from 'react';
import {
    CircularProgress, Typography, Box, Paper, List, ListItem, ListItemText, Button,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Chip, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Added for future edit functionality
import { toast } from 'react-toastify';

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
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
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
    }, [authToken]); // Dependency on authToken to re-fetch if token changes

    useEffect(() => {
        if (authToken) {
            fetchSprints();
        } else {
            setLoading(false);
            setError('Không có token xác thực. Vui lòng đăng nhập lại.');
            setCurrentPage('/login'); // Redirect to login if no token
        }
    }, [authToken, setCurrentPage, fetchSprints]); // Added fetchSprints to dependencies

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
                fetchSprints(); // Re-fetch sprints to update the list
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

    // Helper to get status chip color
    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Hoàn thành':
                return 'success';
            case 'Đang làm':
                return 'info';
            case 'Chưa bắt đầu':
            default:
                return 'default'; // Or 'warning' if you want a distinct color
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Đang tải sprints...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh" flexDirection="column">
                <Typography color="error" variant="h6">{error}</Typography>
                <Button variant="contained" onClick={fetchSprints} sx={{ mt: 2 }}>Thử lại</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 900, margin: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                Quản lý Sprints của bạn
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setCurrentPage('/create-sprint')}
                >
                    Tạo Sprint Mới
                </Button>
            </Box>

            {sprints.length === 0 ? (
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Bạn chưa có sprint nào được tạo.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Nhấn "Tạo Sprint Mới" để bắt đầu!
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <List>
                        {sprints.map((sprint) => (
                            <ListItem
                                key={sprint._id}
                                divider // Adds a divider between list items
                                secondaryAction={
                                    <Box>
                                        {/* <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}
                                            onClick={() => { /* TODO: Implement edit functionality */ /* }}
                                        >
                                            <EditIcon />
                                        </IconButton> */}
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(sprint)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="h2">
                                            {sprint.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Grid container spacing={1} sx={{ mt: 1 }}>
                                            <Grid item xs={12}>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Mô tả: {sprint.description || 'Không có mô tả'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Ngày bắt đầu: {formatDate(sprint.startDate)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography component="span" variant="body2" color="text.secondary">
                                                    Ngày kết thúc: {formatDate(sprint.endDate)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Chip
                                                    label={sprint.status}
                                                    color={getStatusChipColor(sprint.status)}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa Sprint"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa sprint "
                        <Typography component="span" fontWeight="bold">{sprintToDelete?.title}</Typography>
                        " không? Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SprintsPage;