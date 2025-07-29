import React, { useState, useEffect, useCallback } from "react";
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
  useTheme,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { 
  AddCircleOutline as AddCircleOutlineIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api";
const LOADING_DELAY_MS = 1000; // 1-second delay for a smoother experience

function PersonalTask({ authToken, setCurrentPage, currentUserId }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedDepartId, setSelectedDepartId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [myTasks, setMyTasks] = useState([]); // New state for personal tasks
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingMyTasks, setLoadingMyTasks] = useState(true); // New loading state
  const [loadingTaskCreation, setLoadingTaskCreation] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null); // Track which task is being deleted
  const [error, setError] = useState(null);

  const theme = useTheme();

  // Utility for adding delay
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // --- Fetch Sprints ---
  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
    // Don't clear global error here, let combined error handle it
    try {
      const response = await fetch(`${API_BASE_URL}/sprints/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách sprint");
      }

      const data = await response.json();
      const sprintArray = data.sprints;
      if (Array.isArray(sprintArray)) {
        setSprints(sprintArray);
        setSelectedSprintId(sprintArray[0]?._id || "");
      } else {
        toast.error("Dữ liệu sprint trả về không hợp lệ.");
        setSprints([]);
        setSelectedSprintId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sprint:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách sprint: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingSprints(false);
    }
  }, [authToken]);

  // --- Fetch Departments ---
  const fetchDepartments = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingDepartments(false);
      return;
    }

    setLoadingDepartments(true);
    // Don't clear global error here
    try {
      const response = await fetch(`${API_BASE_URL}/departs/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách phòng ban");
      }

      const responseData = await response.json();
      const departmentArray = responseData.data;
      if (Array.isArray(departmentArray)) {
        setDepartments(departmentArray);
        setSelectedDepartId(departmentArray[0]?._id || "");
      } else {
        toast.error("Dữ liệu phòng ban trả về không hợp lệ.");
        setDepartments([]);
        setSelectedDepartId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng ban:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách phòng ban: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingDepartments(false);
    }
  }, [authToken]);

  // --- Fetch My Tasks ---
  const fetchMyTasks = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingMyTasks(false);
      return;
    }

    setLoadingMyTasks(true);
    // Don't clear global error here
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách task cá nhân");
      }

      const data = await response.json();
      const tasksArray = data.tasks;
      if (Array.isArray(tasksArray)) {
        setMyTasks(tasksArray);
      } else {
        toast.error("Dữ liệu task cá nhân trả về không hợp lệ.");
        setMyTasks([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách task cá nhân:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách task cá nhân: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingMyTasks(false);
    }
  }, [authToken]);

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchSprints();
    fetchDepartments();
    fetchMyTasks(); // Fetch personal tasks
  }, [fetchSprints, fetchDepartments, fetchMyTasks]);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    // Reset form fields
    setTaskTitle("");
    setTaskDescription("");
    setSelectedSprintId(sprints[0]?._id || "");
    setSelectedDepartId(departments[0]?._id || "");
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !selectedSprintId || !selectedDepartId) {
      toast.warn("Vui lòng điền Tiêu đề, chọn Sprint và Phòng ban.");
      return;
    }
    if (!currentUserId) {
      toast.error("Không thể tạo task: Thông tin người dùng không có sẵn. Vui lòng đăng nhập lại.");
      return;
    }

    setLoadingTaskCreation(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            departId: selectedDepartId,
            createdBy: currentUserId,
            assignees: [currentUserId], // Assign to self initially
            title: taskTitle,
            description: taskDescription,
            sprint: selectedSprintId, // Ensure sprint ID is sent
          }),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Tạo task thành công!");
        handleCloseForm();
        fetchMyTasks(); // Re-fetch tasks to update the list
      } else {
        toast.error(`Lỗi khi tạo task: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo task:", err);
      toast.error(`Lỗi khi tạo task: ${err.message}`);
    } finally {
      setLoadingTaskCreation(false);
    }
  };

  // --- Delete Task ---
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa task này không?")) {
      return;
    }

    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    setDeletingTaskId(taskId);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success("Xóa task thành công!");
        fetchMyTasks(); // Re-fetch tasks to update the list
      } else {
        const errorData = await response.json();
        toast.error(`Lỗi khi xóa task: ${errorData.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi xóa task:", err);
      toast.error(`Lỗi khi xóa task: ${err.message}`);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Combine loading states for initial render
  if (loadingSprints || loadingDepartments || loadingMyTasks) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "80vh",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" />
        <Typography
          variant="h6"
          sx={{ mt: 2, color: theme.palette.text.secondary }}
        >
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  // Handle errors for any fetch operation after initial load attempt
  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          m: 2,
        }}
      >
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Đã xảy ra lỗi: {error.message || "Lỗi không xác định"}
        </Typography>
        <Button variant="contained" onClick={() => {
          setError(null); // Clear error before retrying
          fetchSprints();
          fetchDepartments();
          fetchMyTasks();
        }} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case "not_started":
      case "notstarted":
        return "default";
      case "in_progress":
      case "inprogress":
        return "info";
      case "completed":
        return "success";
      case "on_hold":
      case "onhold":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityChipColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "default";
      case "medium":
        return "info";
      case "high":
        return "warning";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  const formatVietnameseDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ p: 2, maxWidth: 900, margin: "auto", mt: 2 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main, mb: 2 }}
        >
          Quản lý Task Cá Nhân
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenForm}
          sx={{ 
            borderRadius: 3, 
            py: 1.8, 
            px: 4, 
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          Tạo Task Mới
        </Button>
      </Box>

      {/* Tasks Section */}
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Các Task của bạn
        </Typography>
        {myTasks.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: theme.palette.background.default,
              borderRadius: 3,
              border: `2px dashed ${theme.palette.divider}`,
            }}
          >
            <TaskIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 2 }} />
            <Typography variant="h5" color="text.disabled" sx={{ mb: 1 }}>
              Bạn chưa có task nào
            </Typography>
            <Typography variant="h6" color="text.disabled">
              Hãy tạo một task mới để bắt đầu!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {myTasks.map((task) => (
              <Card
                key={task._id}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: "all 0.3s ease",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Title and Status Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography 
                      variant="h4" 
                      component="div" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                        flex: 1,
                        textAlign: 'right',
                        mr: 3
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Chip
                        label={task.status?.replace(/_/g, ' ').toUpperCase()}
                        color={getStatusChipColor(task.status)}
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          height: 40,
                          '& .MuiChip-label': { px: 3, py: 1 }
                        }}
                      />
                      <Chip
                        label={`${task.priority?.toUpperCase()}`}
                        color={getPriorityChipColor(task.priority)}
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          height: 40,
                          '& .MuiChip-label': { px: 3, py: 1 }
                        }}
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteTask(task._id)}
                        disabled={deletingTaskId === task._id}
                        startIcon={
                          deletingTaskId === task._id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        sx={{
                          minWidth: 44,
                          height: 40,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'error.light',
                            color: 'white',
                            borderColor: 'error.main'
                          }
                        }}
                      >
                        {deletingTaskId === task._id ? '' : ''}
                      </Button>
                    </Box>
                  </Box>

                  {/* Description Row */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        minWidth: 80,
                        color: theme.palette.text.primary
                      }}
                    >
                      Mô tả:
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ 
                        flex: 1,
                        lineHeight: 1.4,
                        bgcolor: theme.palette.action.hover,
                        p: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette.primary.main}`
                      }}
                    >
                      {task.description || "Không có mô tả."}
                    </Typography>
                  </Box>

                  {/* Info Section */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    bgcolor: theme.palette.background.default,
                    p: 2.5,
                    borderRadius: 2,
                    gap: 3
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                        <PersonIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.9rem' }}>
                          Tạo bởi
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {task.createdBy?.name || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center' }}>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 40, height: 40 }}>
                        <CalendarIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.9rem' }}>
                          Ngày tạo
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {formatVietnameseDate(task.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {task.assignees && task.assignees.length > 0 && (
                      <>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center' }}>
                          <Avatar sx={{ bgcolor: theme.palette.success.main, width: 40, height: 40 }}>
                            <PersonIcon sx={{ fontSize: 24 }} />
                          </Avatar>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.9rem' }}>
                              Người được giao
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {task.assignees.map(a => a.name).join(', ')}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          Tạo Task Mới
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Tiêu đề Task"
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            required
          />
          <TextField
            select
            label="Chọn Phòng ban"
            fullWidth
            value={selectedDepartId}
            onChange={(e) => setSelectedDepartId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={departments.length === 0}
          >
            {departments.length === 0 ? (
              <MenuItem value="">Không có Phòng ban nào khả dụng</MenuItem>
            ) : (
              departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.title}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            label="Chọn Sprint"
            fullWidth
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={sprints.length === 0}
          >
            {sprints.length === 0 ? (
              <MenuItem value="">Không có Sprint nào khả dụng</MenuItem>
            ) : (
              sprints.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.title}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Mô tả Task"
            fullWidth
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCreateTask}
            color="primary"
            variant="contained"
            disabled={loadingTaskCreation}
            startIcon={loadingTaskCreation ? <CircularProgress size={20} /> : null}
          >
            {loadingTaskCreation ? "Đang tạo..." : "Tạo Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalTask;