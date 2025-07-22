import React, { useState, useMemo, useCallback } from 'react';
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
  CalendarMonth as CalendarMonthIcon, // Added Calendar icon
} from '@mui/icons-material';

// Simulate a current user ID for demonstration
const CURRENT_USER_ID = 'user-123';
const ASSIGNER_USER_ID = 'user-assigner-456'; // A different user ID for assigned tasks

// Initial state for a new task form - Removed 'description'
const initialFormState = {
  id: null,
  title: '',
  date: '',
  time: '',
  completionPercentage: 0,
  isAssigned: false,
  createdBy: null,
};

function PersonalTask({ setCurrentPage }) { // Accept setCurrentPage prop
  const [selfCreatedTasks, setSelfCreatedTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('selfCreatedTasks');
      return storedTasks ? JSON.parse(storedTasks) : [
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
      ];
    } catch (error) {
      console.error("Failed to parse selfCreatedTasks from localStorage", error);
      return [];
    }
  });

  const [assignedTasks, setAssignedTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('assignedTasks');
      return storedTasks ? JSON.parse(storedTasks) : [
        {
          id: 'assigned-1', title: 'Hello world2', date: '2025-07-25', time: '17:00',
          completionPercentage: 25,
          comments: [
            { id: Date.now() - 3000, text: 'Cần số liệu từ phòng kinh doanh.', timestamp: '2025-07-20 10:00:00' },
            { id: Date.now() - 2500, text: 'Đã gửi yêu cầu lấy số liệu.', timestamp: '2025-07-20 14:00:00' },
          ],
          isAssigned: true, createdBy: ASSIGNER_USER_ID
        },
        {
          id: 'assigned-2', title: 'Hello world', date: '2025-07-22', time: '10:00',
          completionPercentage: 75,
          comments: [], isAssigned: true, createdBy: ASSIGNER_USER_ID
        },
        {
          id: 'assigned-3', title: 'Họp ban quản lý', date: '2025-07-23', time: '09:00',
          completionPercentage: 100,
          comments: [
            { id: Date.now() - 1500, text: 'Đã hoàn thành chuẩn bị tài liệu.', timestamp: '2025-07-21 14:30:00' },
          ],
          isAssigned: true, createdBy: ASSIGNER_USER_ID
        },
      ];
    } catch (error) {
      console.error("Failed to parse assignedTasks from localStorage", error);
      return [];
    }
  });

  // Persist tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('selfCreatedTasks', JSON.stringify(selfCreatedTasks));
  }, [selfCreatedTasks]);

  React.useEffect(() => {
    localStorage.setItem('assignedTasks', JSON.stringify(assignedTasks));
  }, [assignedTasks]);


  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [taskCommentInput, setTaskCommentInput] = useState({});

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const openTaskDialog = useCallback((task = null) => {
    if (task && !task.isAssigned && task.createdBy !== CURRENT_USER_ID) {
      showSnackbar('Bạn không có quyền chỉnh sửa nhiệm vụ này.', 'error');
      return;
    }
    setEditingTask(task);
    setFormData(task ? { ...task } : { ...initialFormState, id: Date.now(), isAssigned: false, createdBy: CURRENT_USER_ID });
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

  const handleSaveTask = useCallback(() => {
    if (!formData.title || !formData.date || !formData.time) {
      showSnackbar('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Ngày, Giờ).', 'error');
      return;
    }

    const taskToSave = { ...formData };

    const updateTaskLists = (prevTasksList) => {
      if (editingTask) {
        return prevTasksList.map((task) => (task.id === taskToSave.id ? taskToSave : task));
      } else {
        return [...prevTasksList, { ...taskToSave, comments: [] }];
      }
    };

    if (taskToSave.isAssigned) {
      setAssignedTasks(updateTaskLists);
    } else {
      setSelfCreatedTasks(updateTaskLists);
    }

    showSnackbar(
      editingTask ? 'Mục nhiệm vụ đã được cập nhật thành công!' : 'Mục nhiệm vụ đã được tạo thành công!',
      'success'
    );
    closeDialog();
  }, [formData, editingTask, showSnackbar, closeDialog]);

  const handleDeleteTask = useCallback((idToDelete, isAssigned, createdBy) => {
    if (isAssigned) {
      showSnackbar('Không thể xóa nhiệm vụ được giao trực tiếp từ đây.', 'warning');
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


  const handleAddComment = useCallback((taskId, isAssigned) => {
    const newCommentText = taskCommentInput[taskId] || '';
    if (newCommentText.trim() === '') {
      showSnackbar('Bình luận không được để trống.', 'error');
      return;
    }

    const newComment = {
      id: Date.now(),
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const updateComments = (prevTasksList) =>
      prevTasksList.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...(task.comments || []), newComment] }
          : task
      );

    if (isAssigned) {
      setAssignedTasks(updateComments);
    } else {
      setSelfCreatedTasks(updateComments);
    }

    setTaskCommentInput((prev) => ({ ...prev, [taskId]: '' }));
    showSnackbar('Bình luận đã được thêm!', 'success');
  }, [taskCommentInput, showSnackbar]);

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
                            onChange={(e) => {
                              const newValue = e.target.checked ? 100 : task.completionPercentage;
                              if (task.isAssigned) {
                                setAssignedTasks(prev => prev.map(t => t.id === task.id ? { ...t, completionPercentage: newValue } : t));
                              } else {
                                setSelfCreatedTasks(prev => prev.map(t => t.id === task.id ? { ...t, completionPercentage: newValue } : t));
                              }
                              showSnackbar('Trạng thái hoàn thành đã được cập nhật!', 'info');
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
                          Người tạo: {task.createdBy === CURRENT_USER_ID ? 'Bạn' : 'Người giao'}
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
                                Bạn:
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