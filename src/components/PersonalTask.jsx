import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Slider,
  FormControlLabel,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import axios from 'axios'; // Import Axios

// Simulate a current user ID for demonstration (will be replaced by actual user ID from auth)
// In a real application, this CURRENT_USER_ID would come from your authentication context.
const CURRENT_USER_ID = 'user-123'; // This will represent the authenticated user's ID
const ASSIGNER_USER_ID = 'user-assigner-456'; // A different user ID for assigned tasks

// Base URL for your API
const API_BASE_URL = '/api/task'; // Adjust if your API is on a different path or port

// Initial state for a new task form
const initialFormState = {
  id: null,
  title: '',
  date: '',
  time: '',
  completionPercentage: 0,
  isAssigned: false, // This flag helps differentiate in FE logic
  createdBy: null,
  status: 'not_started', // Map completionPercentage to status
};

function PersonalTask({ setCurrentPage }) {
  const [selfCreatedTasks, setSelfCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  // State for UI interactions
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [taskCommentInput, setTaskCommentInput] = useState({});

  // Assume you have a way to get the auth token
  const getAuthToken = useCallback(() => {
    // Replace with your actual token retrieval logic (e.g., from localStorage, context)
    return localStorage.getItem('authToken'); // Example
  }, []);

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // --- Fetch Tasks from Backend ---
  const fetchMyTasks = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/my-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming tasks from backend are 'assigned' tasks
      const formattedAssignedTasks = response.data.map(task => ({
        id: task._id, // Backend uses _id
        title: task.title,
        description: task.description, // Assuming description exists
        date: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '', // Adjust as per your backend's date format
        time: task.dueDate ? new Date(task.dueDate).toTimeString().split(' ')[0].substring(0, 5) : '', // Adjust time
        completionPercentage: task.status === 'completed' ? 100 : (task.status === 'in_progress' ? 50 : 0), // Map status to percentage
        isAssigned: true,
        createdBy: task.createdBy, // Backend provides createdBy
        comments: task.comments.map(comment => ({ // Map backend comments to frontend format
          id: comment._id || Date.now(),
          text: comment.content,
          timestamp: new Date(comment.date).toLocaleString(),
          userId: comment.userId,
        })),
        status: task.status, // Keep original status
      }));
      setAssignedTasks(formattedAssignedTasks);
    } catch (error) {
      console.error("Lỗi khi tải nhiệm vụ được giao:", error);
      showSnackbar('Lỗi khi tải nhiệm vụ được giao.', 'error');
    }
  }, [getAuthToken, showSnackbar]);

  // Initial load of assigned tasks
  useEffect(() => {
    fetchMyTasks();
    // For self-created tasks, if you manage them locally or have a separate API, load them here.
    // For now, keep the local storage logic for self-created tasks as a fallback/example.
    try {
      const storedSelfCreatedTasks = localStorage.getItem('selfCreatedTasks');
      setSelfCreatedTasks(storedSelfCreatedTasks ? JSON.parse(storedSelfCreatedTasks) : [
        {
          id: 'self-1', title: 'Viết bài blog mới', date: '2025-07-28', time: '14:00',
          completionPercentage: 50,
          comments: [{ id: Date.now() - 4000, text: 'Hello worldHello worldHello worldHello world', timestamp: '2025-07-20 09:00:00' }],
          isAssigned: false, createdBy: CURRENT_USER_ID
        },
        {
          id: 'self-2', title: 'Hello world3', date: '2025-07-24', time: '11:00',
          completionPercentage: 100,
          comments: [], isAssigned: false, createdBy: CURRENT_USER_ID
        },
      ]);
    } catch (error) {
      console.error("Failed to parse selfCreatedTasks from localStorage", error);
    }
  }, [fetchMyTasks]);

  // Persist self-created tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('selfCreatedTasks', JSON.stringify(selfCreatedTasks));
  }, [selfCreatedTasks]);

  // The assignedTasks are now primarily managed by the backend, so no localStorage persist for them.


  const openTaskDialog = useCallback((task = null) => {
    // Allow editing assigned tasks for completion percentage, but not title/date/time
    if (task && task.isAssigned) {
      setEditingTask(task);
      setFormData({ ...task });
    } else if (task && !task.isAssigned && task.createdBy !== CURRENT_USER_ID) {
      showSnackbar('Bạn không có quyền chỉnh sửa nhiệm vụ này.', 'error');
      return;
    } else {
      setEditingTask(task);
      setFormData(task ? { ...task } : { ...initialFormState, id: Date.now(), isAssigned: false, createdBy: CURRENT_USER_ID });
    }
    setOpenDialog(true);
  }, [showSnackbar]);

  const closeDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingTask(null);
    setFormData(initialFormState);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 100 : 0) : value,
    }));
  }, []);

  const handleSliderChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      completionPercentage: newValue,
    }));
  }, []);

  const handleSaveTask = useCallback(async () => {
    if (!formData.title || !formData.date || !formData.time) {
      showSnackbar('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Ngày, Giờ).', 'error');
      return;
    }

    const taskToSave = { ...formData };
    const token = getAuthToken();
    if (!token) {
      showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
      return;
    }

    if (taskToSave.isAssigned) {
      // For assigned tasks, only update status/completion percentage via submitTaskInfo
      try {
        const newStatus = taskToSave.completionPercentage === 100 ? 'completed' : (taskToSave.completionPercentage > 0 ? 'in_progress' : 'not_started');
        await axios.post(`${API_BASE_URL}/${taskToSave.id}/submit`, {
          submitInfo: {
            completionPercentage: taskToSave.completionPercentage,
            status: newStatus,
            // You can add more info here if needed for submission
          }
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar('Trạng thái nhiệm vụ được giao đã được cập nhật!', 'success');
        fetchMyTasks(); // Re-fetch assigned tasks to get latest state from backend
        closeDialog();
      } catch (error) {
        console.error("Lỗi khi cập nhật nhiệm vụ được giao:", error);
        showSnackbar('Lỗi khi cập nhật nhiệm vụ được giao.', 'error');
      }
    } else {
      // For self-created tasks, continue with local state management
      const updateTaskLists = (prevTasksList) => {
        if (editingTask) {
          return prevTasksList.map((task) => (task.id === taskToSave.id ? taskToSave : task));
        } else {
          return [...prevTasksList, { ...taskToSave, comments: [] }];
        }
      };
      setSelfCreatedTasks(updateTaskLists);
      showSnackbar(
        editingTask ? 'Mục nhiệm vụ tự tạo đã được cập nhật thành công!' : 'Mục nhiệm vụ tự tạo đã được tạo thành công!',
        'success'
      );
      closeDialog();
    }
  }, [formData, editingTask, showSnackbar, closeDialog, getAuthToken, fetchMyTasks]);

  const handleDeleteTask = useCallback((idToDelete, isAssigned, createdBy) => {
    if (isAssigned) {
      showSnackbar('Không thể xóa nhiệm vụ được giao trực tiếp từ đây. Vui lòng liên hệ người giao nhiệm vụ.', 'warning');
      return;
    }
    if (createdBy !== CURRENT_USER_ID) {
      showSnackbar('Bạn không có quyền xóa nhiệm vụ này.', 'error');
      return;
    }

    setSelfCreatedTasks((prevTasks) => prevTasks.filter((task) => task.id !== idToDelete));
    showSnackbar('Mục nhiệm vụ tự tạo đã được xóa thành công!', 'success');
  }, [showSnackbar]);


  const getCompletionPercentage = useCallback((tasksList) => {
    if (tasksList.length === 0) {
      return 0;
    }
    const totalPercentage = tasksList.reduce((sum, task) => sum + task.completionPercentage, 0);
    return Math.round(totalPercentage / tasksList.length);
  }, []);

  // Combine and sort all tasks by date and time
  const allSortedTasks = useMemo(() => {
    const all = [...selfCreatedTasks, ...assignedTasks];
    return [...all].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });
  }, [selfCreatedTasks, assignedTasks]);

  const overallCompletion = useMemo(() => {
    return getCompletionPercentage(allSortedTasks);
  }, [allSortedTasks, getCompletionPercentage]);


  const handleAddComment = useCallback(async (taskId, isAssigned) => {
    const newCommentText = taskCommentInput[taskId] || '';
    if (newCommentText.trim() === '') {
      showSnackbar('Bình luận không được để trống.', 'error');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
      return;
    }

    try {
      if (isAssigned) {
        // Send comment to backend for assigned tasks
        await axios.post(`${API_BASE_URL}/${taskId}/comment`, {
          comment: newCommentText.trim(),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showSnackbar('Bình luận đã được thêm vào nhiệm vụ được giao!', 'success');
        fetchMyTasks(); // Re-fetch tasks to update comments
      } else {
        // For self-created tasks, update locally
        const newComment = {
          id: Date.now(),
          text: newCommentText.trim(),
          timestamp: new Date().toLocaleString(),
          userId: CURRENT_USER_ID, // Assuming current user is creator of self-created task
        };
        setSelfCreatedTasks((prevTasksList) =>
          prevTasksList.map((task) =>
            task.id === taskId
              ? { ...task, comments: [...(task.comments || []), newComment] }
              : task
          )
        );
        showSnackbar('Bình luận đã được thêm vào nhiệm vụ tự tạo!', 'success');
      }
      setTaskCommentInput((prev) => ({ ...prev, [taskId]: '' }));
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      showSnackbar('Lỗi khi thêm bình luận.', 'error');
    }
  }, [taskCommentInput, showSnackbar, getAuthToken, fetchMyTasks]);

  const handleViewTimeline = useCallback(() => {
    setCurrentPage('/timeline');
  }, [setCurrentPage]);


  return (
    <Box sx={{ p: 1.5, maxWidth: 1000, margin: 'auto', mt: 2, bgcolor: '#f9f9f9', borderRadius: 1, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="h6" color="primary" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
          Quản lý Nhiệm vụ của Tôi
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon fontSize="small" />}
            onClick={handleViewTimeline}
            size="small"
            sx={{ mr: 1 }}
          >
            Xem Timeline
          </Button>
          <Button variant="contained" startIcon={<AddIcon fontSize="small" />} onClick={() => openTaskDialog(null)} size="small">
            Tạo Nhiệm vụ Mới
          </Button>
        </Box>
      </Box>

      {/* Overall Progress */}
      <Box sx={{ width: '100%', mb: 2.5, p: 1, bgcolor: '#e3f2fd', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2" sx={{ mb: 0.5, color: 'primary.dark', fontWeight: 'bold' }}>
          Tổng quan Tiến độ hoàn thành: {overallCompletion}%
        </Typography>
        <LinearProgress variant="determinate" value={overallCompletion} sx={{ height: 6, borderRadius: 3, bgcolor: '#bbdefb' }} />
      </Box>

      {/* Original Combined and Sorted Task List */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          Chi tiết nhiệm vụ
        </Typography>
        {allSortedTasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5, mb: 0.5 }}>
            Chưa có nhiệm vụ nào!
          </Typography>
        ) : (
          <List dense>
            {allSortedTasks.map((task) => (
              <Card
                key={task.id}
                sx={{
                  mb: 1.5,
                  border: '1px solid #e0e0e0',
                  boxShadow: 1,
                  bgcolor: task.completionPercentage === 100 ? '#e8f5e9' : 'white',
                  opacity: task.completionPercentage === 100 ? 0.9 : 1,
                }}
              >
                <CardContent sx={{ p: '12px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={task.completionPercentage === 100}
                            onChange={async (e) => {
                              const newValue = e.target.checked ? 100 : task.completionPercentage;
                              const newStatus = e.target.checked ? 'completed' : (task.completionPercentage > 0 ? 'in_progress' : 'not_started');
                              const token = getAuthToken();

                              if (!token) {
                                showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
                                return;
                              }

                              if (task.isAssigned) {
                                try {
                                  await axios.post(`${API_BASE_URL}/${task.id}/submit`, {
                                    submitInfo: {
                                      completionPercentage: newValue,
                                      status: newStatus,
                                    }
                                  }, {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  });
                                  showSnackbar('Trạng thái hoàn thành đã được cập nhật!', 'info');
                                  fetchMyTasks(); // Re-fetch to get updated task
                                } catch (error) {
                                  console.error("Lỗi khi cập nhật trạng thái nhiệm vụ được giao:", error);
                                  showSnackbar('Lỗi khi cập nhật trạng thái nhiệm vụ được giao.', 'error');
                                }
                              } else {
                                setSelfCreatedTasks(prev => prev.map(t => t.id === task.id ? { ...t, completionPercentage: newValue } : t));
                                showSnackbar('Trạng thái hoàn thành đã được cập nhật!', 'info');
                              }
                            }}
                            color="primary"
                            size="small"
                            sx={{ mt: -0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body1" sx={{ display: 'inline-block', ml: 0.5, textDecoration: task.completionPercentage === 100 ? 'line-through' : 'none', fontWeight: 'bold' }}>
                            {task.title}
                          </Typography>
                        }
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 3.5 }}>
                        Ngày: {task.date} lúc {task.time}
                      </Typography>
                      {task.createdBy && (
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', ml: 3.5 }}>
                          Người tạo: {task.createdBy === CURRENT_USER_ID ? 'Bạn' : (task.isAssigned ? 'Người giao' : task.createdBy)}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flexShrink: 0 }}>
                      {(task.createdBy === CURRENT_USER_ID && !task.isAssigned) || task.isAssigned ? (
                        <IconButton color="primary" size="small" onClick={() => openTaskDialog(task)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : null}
                      {!task.isAssigned && task.createdBy === CURRENT_USER_ID && (
                        <IconButton color="error" size="small" onClick={() => handleDeleteTask(task.id, task.isAssigned, task.createdBy)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {/* Comment Section (Facebook-like) */}
                  <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 1.5, ml: 3.5 }}>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                      Bình luận ({task.comments ? task.comments.length : 0})
                    </Typography>
                    {task.comments && task.comments.length > 0 ? (
                      <List dense sx={{ maxHeight: 80, overflowY: 'auto', mb: 0.5 }}>
                        {task.comments.map((comment) => (
                          <ListItemText
                            key={comment.id}
                            primary={
                              <Typography variant="caption" component="span" sx={{ fontWeight: 'bold' }}>
                                {/* Display 'You' if userId matches CURRENT_USER_ID, otherwise display the userId or a generic 'Người khác' */}
                                {comment.userId === CURRENT_USER_ID ? 'Bạn:' : (task.isAssigned && task.createdBy === comment.userId ? 'Người giao:' : 'Người khác:')}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="caption" color="text.primary" display="inline">
                                  {comment.text}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.6rem' }}>
                                  {comment.timestamp}
                                </Typography>
                              </>
                            }
                            sx={{ mb: 0.2, bgcolor: '#f5f5f5', p: 0.5, borderRadius: 1 }}
                          />
                        ))}
                      </List>
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        Chưa có bình luận nào.
                      </Typography>
                    )}
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Viết bình luận..."
                      value={taskCommentInput[task.id] || ''}
                      onChange={(e) => setTaskCommentInput((prev) => ({ ...prev, [task.id]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(task.id, task.isAssigned);
                          e.preventDefault();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleAddComment(task.id, task.isAssigned)}
                              edge="end"
                              color="primary"
                              disabled={!taskCommentInput[task.id] || taskCommentInput[task.id].trim() === ''}
                              size="small"
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Box>

      {/* Task Dialog (Create/Edit) */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{editingTask ? 'Chỉnh Sửa Nhiệm Vụ' : 'Tạo Nhiệm Vụ Mới'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Tiêu đề"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 1.5 }}
            disabled={editingTask?.isAssigned} // Disable title for assigned tasks
            size="small"
          />
          <TextField
            margin="dense"
            id="date"
            name="date"
            label="Ngày"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleInputChange}
            required
            sx={{ mb: 1.5 }}
            disabled={editingTask?.isAssigned} // Disable for assigned tasks
            size="small"
          />
          <TextField
            margin="dense"
            id="time"
            name="time"
            label="Giờ"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.time}
            onChange={handleInputChange}
            required
            sx={{ mb: 1.5 }}
            disabled={editingTask?.isAssigned} // Disable for assigned tasks
            size="small"
          />

          {/* Adjustable completion percentage slider */}
          <Typography gutterBottom variant="body2" sx={{ mt: 1.5, fontWeight: 'bold' }}>
            Phần trăm hoàn thành: {formData.completionPercentage}%
          </Typography>
          <Slider
            value={formData.completionPercentage}
            onChange={handleSliderChange}
            aria-labelledby="completion-slider"
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={100}
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: '8px 16px' }}>
          <Button onClick={closeDialog} size="small">Hủy</Button>
          <Button onClick={handleSaveTask} variant="contained" size="small">
            {editingTask ? 'Cập nhật' : 'Tạo'}
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