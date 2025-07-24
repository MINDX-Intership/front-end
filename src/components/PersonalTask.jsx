// PersonalTask.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

function PersonalTask({ authToken, setCurrentPage }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [loadingTaskCreation, setLoadingTaskCreation] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const theme = useTheme();

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/sprint/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSprints(response.data);
      if (response.data.length > 0) {
        setSelectedSprintId(response.data[0]._id); // Pre-select the first sprint
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách sprint:', err);
      setError(err);
      showSnackbar('Lỗi khi tải danh sách sprint. Vui lòng thử lại.', 'error');
    } finally {
      setLoadingSprints(false);
    }
  }, [authToken, showSnackbar]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    // Reset form fields
    setTaskTitle('');
    setTaskDescription('');
    // Keep selectedSprintId as is or reset to first if preferred
    if (sprints.length > 0) {
      setSelectedSprintId(sprints[0]._id);
    } else {
      setSelectedSprintId('');
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !selectedSprintId) {
      showSnackbar('Vui lòng điền Tiêu đề và chọn Sprint.', 'warning');
      return;
    }

    setLoadingTaskCreation(true);
    try {
      const payload = {
        title: taskTitle,
        description: taskDescription,
        sprintId: selectedSprintId,
      };

      const response = await axios.post(`${API_BASE_URL}/task/add`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 201) {
        showSnackbar('Tạo task thành công!', 'success');
        handleCloseForm();
        // You might want to re-fetch tasks here or update the UI
        // For now, we just close the form.
      } else {
        showSnackbar(`Lỗi khi tạo task: ${response.data.message || 'Lỗi không xác định'}`, 'error');
      }
    } catch (err) {
      console.error('Lỗi khi tạo task:', err);
      showSnackbar(`Lỗi khi tạo task: ${err.response?.data?.message || err.message || 'Lỗi mạng'}`, 'error');
    } finally {
      setLoadingTaskCreation(false);
    }
  };

  if (loadingSprints) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
          Đang tải danh sách Sprint...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: theme.palette.background.paper, borderRadius: 2, m: 2 }}>
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Đã xảy ra lỗi khi tải sprint: {error.message || 'Lỗi không xác định'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vui lòng kiểm tra kết nối mạng của bạn hoặc thử lại sau.
        </Typography>
        <Button
            variant="contained"
            color="primary"
            onClick={fetchSprints}
            sx={{ mt: 2 }}
        >
            Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        Quản lý Task Cá Nhân
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpenForm}
        sx={{ mb: 3, borderRadius: 2 }}
      >
        Tạo Task Mới
      </Button>

      {/* Existing Task List (Placeholder for now) */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Các Task của bạn
        </Typography>
        {/* In a real application, you would fetch and display tasks here */}
        <Typography variant="body1" color="text.disabled">
          Danh sách task sẽ được hiển thị ở đây. (Chức năng này đang được phát triển)
        </Typography>
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          Tạo Task Mới
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề Task"
            type="text"
            fullWidth
            variant="outlined"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mô tả Task"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Chọn Sprint"
            fullWidth
            variant="outlined"
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            disabled={sprints.length === 0}
          >
            {sprints.length === 0 ? (
              <MenuItem value="">Không có Sprint nào khả dụng</MenuItem>
            ) : (
              sprints.map((sprint) => (
                <MenuItem key={sprint._id} value={sprint._id}>
                  {sprint.title}
                </MenuItem>
              ))
            )}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseForm} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCreateTask}
            color="primary"
            variant="contained"
            disabled={loadingTaskCreation || sprints.length === 0 || !taskTitle || !selectedSprintId}
            startIcon={loadingTaskCreation ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loadingTaskCreation ? 'Đang tạo...' : 'Tạo Task'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PersonalTask;