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
  IconButton,
  FormControl, // Import FormControl for select
  InputLabel,   // Import InputLabel for select
  Select,      // Import Select for multi-select
  OutlinedInput, // Import OutlinedInput for multi-select
} from "@mui/material";
import { 
  AddCircleOutline as AddCircleOutlineIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:3000/api";
const LOADING_DELAY_MS = 1000;

function PersonalTask({ authToken, setCurrentPage, currentUserId }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedDepartId, setSelectedDepartId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingMyTasks, setLoadingMyTasks] = useState(true);
  const [loadingTaskCreation, setLoadingTaskCreation] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editSelectedSprintId, setEditSelectedSprintId] = useState("");
  const [editSelectedDepartId, setEditSelectedDepartId] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("");
  const [loadingTaskUpdate, setLoadingTaskUpdate] = useState(false);

  // New state for users and selected assignees
  const [users, setUsers] = useState([]);
  const [editSelectedAssignees, setEditSelectedAssignees] = useState([]); 
  const [loadingUsers, setLoadingUsers] = useState(true);

  const theme = useTheme();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // --- Fetch Sprints ---
  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
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
        if (!selectedSprintId && sprintArray.length > 0) {
          setSelectedSprintId(sprintArray[0]?._id || "");
        }
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
  }, [authToken, selectedSprintId]);

  // --- Fetch Departments ---
  const fetchDepartments = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingDepartments(false);
      return;
    }

    setLoadingDepartments(true);
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
        if (!selectedDepartId && departmentArray.length > 0) {
          setSelectedDepartId(departmentArray[0]?._id || "");
        }
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
  }, [authToken, selectedDepartId]);

  // --- Fetch My Tasks ---
  const fetchMyTasks = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingMyTasks(false);
      return;
    }

    setLoadingMyTasks(true);
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

  // --- New: Fetch Users for Assignees ---
  const fetchUsers = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingUsers(false);
      return;
    }
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, { // Assuming an API endpoint to get all users
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách người dùng");
      }
      const data = await response.json();
      // Assuming data.users contains an array of user objects with _id and name
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        toast.error("Dữ liệu người dùng trả về không hợp lệ.");
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách người dùng: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingUsers(false);
    }
  }, [authToken]);

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchSprints();
    fetchDepartments();
    fetchMyTasks();
    fetchUsers(); // Fetch users when component mounts
  }, [fetchSprints, fetchDepartments, fetchMyTasks, fetchUsers]);

  const handleOpenForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setSelectedSprintId(sprints[0]?._id || "");
    setSelectedDepartId(departments[0]?._id || "");
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
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
            assignees: [currentUserId], // Gán cho chính người tạo ban đầu
            title: taskTitle,
            description: taskDescription,
            sprintId: selectedSprintId,
          }),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Tạo task thành công!");
        handleCloseForm();
        fetchMyTasks();
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
        fetchMyTasks();
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

  // --- Handle opening edit form ---
  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditSelectedSprintId(task.sprintId?._id || ""); 
    setEditSelectedDepartId(task.departId?._id || ""); 
    setEditTaskStatus(task.status || "NOTSTARTED");
    setEditTaskPriority(task.priority || "MEDIUM");
    // Set selected assignees for the edit form
    // task.assignees is an array of populated user objects. We need their IDs.
    setEditSelectedAssignees(task.assignees?.map(assignee => assignee._id) || []);
    setOpenEditForm(true);
  };

  // --- Handle closing edit form ---
  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setEditingTask(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditSelectedSprintId("");
    setEditSelectedDepartId("");
    setEditTaskStatus("");
    setEditTaskPriority("");
    setEditSelectedAssignees([]); // Reset assignees selection
  };

  // --- Handle updating task ---
  const handleUpdateTask = async () => {
    if (!editingTask || !editTaskTitle || !editSelectedSprintId || !editSelectedDepartId) {
      toast.warn("Vui lòng điền Tiêu đề, chọn Sprint và Phòng ban cho task đang chỉnh sửa.");
      return;
    }
    if (editSelectedAssignees.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một người được giao.");
      return;
    }

    setLoadingTaskUpdate(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/${editingTask._id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: editTaskTitle,
            description: editTaskDescription,
            sprintId: editSelectedSprintId,
            departId: editSelectedDepartId,
            status: editTaskStatus.toUpperCase(),
            priority: editTaskPriority.toUpperCase(),
            assignees: editSelectedAssignees, // Gửi mảng các ID người dùng đã chọn
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Cập nhật task thành công!");
        handleCloseEditForm();
        fetchMyTasks();
      } else {
        toast.error(`Lỗi khi cập nhật task: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật task:", err);
      toast.error(`Lỗi khi cập nhật task: ${err.message}`);
    } finally {
      setLoadingTaskUpdate(false);
    }
  };

  // Handle change for multi-select assignees
  const handleChangeAssignees = (event) => {
    const {
      target: { value },
    } = event;
    setEditSelectedAssignees(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // Combine loading states for initial render
  if (loadingSprints || loadingDepartments || loadingMyTasks || loadingUsers) {
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
          setError(null);
          fetchSprints();
          fetchDepartments();
          fetchMyTasks();
          fetchUsers();
        }} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  const getStatusChipColor = (status) => {
    switch (status?.toUpperCase()) {
      case "NOTSTARTED":
        return "default";
      case "INPROGRESS":
        return "info";
      case "COMPLETE":
        return "success";
      case "SUBMITTED":
        return "primary";
      case "NEEDSREVIEW":
        return "warning";
      case "OVERDUE":
        return "error";
      case "ONHOLD":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityChipColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "LOW":
        return "default";
      case "MEDIUM":
        return "info";
      case "HIGH":
        return "warning";
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
                        textAlign: 'left',
                        mr: 3
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Chip
                        label={task.status?.toUpperCase().replace(/_/g, ' ')}
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
                      {/* Edit Button */}
                      <IconButton 
                        aria-label="edit task" 
                        onClick={() => handleOpenEditForm(task)}
                        color="primary"
                        sx={{
                          border: `1px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'white',
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
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

      {/* Dialog for Creating New Task */}
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

      {/* Dialog for Editing Task */}
      <Dialog open={openEditForm} onClose={handleCloseEditForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          Chỉnh sửa Task
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Tiêu đề Task"
            fullWidth
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            required
          />
          <TextField
            select
            label="Chọn Phòng ban"
            fullWidth
            value={editSelectedDepartId}
            onChange={(e) => setEditSelectedDepartId(e.target.value)}
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
            value={editSelectedSprintId}
            onChange={(e) => setEditSelectedSprintId(e.target.value)}
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
          {/* New: Assignees Multi-select */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="assignees-label">Người được giao</InputLabel>
            <Select
              labelId="assignees-label"
              id="assignees-select"
              multiple
              value={editSelectedAssignees}
              onChange={handleChangeAssignees}
              input={<OutlinedInput label="Người được giao" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const user = users.find(u => u._id === value);
                    return <Chip key={value} label={user ? user.name : value} />;
                  })}
                </Box>
              )}
              disabled={users.length === 0}
            >
              {users.length === 0 ? (
                <MenuItem disabled value="">Không có người dùng nào khả dụng</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            select
            label="Trạng thái"
            fullWidth
            value={editTaskStatus}
            onChange={(e) => setEditTaskStatus(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="NOTSTARTED">Chưa bắt đầu</MenuItem>
            <MenuItem value="INPROGRESS">Đang thực hiện</MenuItem>
            <MenuItem value="SUBMITTED">Đã gửi</MenuItem>
            <MenuItem value="NEEDSREVIEW">Cần xem xét</MenuItem>
            <MenuItem value="COMPLETE">Hoàn thành</MenuItem>
            <MenuItem value="OVERDUE">Quá hạn</MenuItem>
            <MenuItem value="ONHOLD">Tạm dừng</MenuItem>
          </TextField>
          <TextField
            select
            label="Mức độ ưu tiên"
            fullWidth
            value={editTaskPriority}
            onChange={(e) => setEditTaskPriority(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="LOW">Thấp</MenuItem>
            <MenuItem value="MEDIUM">Trung bình</MenuItem>
            <MenuItem value="HIGH">Cao</MenuItem>
          </TextField>
          <TextField
            label="Mô tả Task"
            fullWidth
            multiline
            rows={4}
            value={editTaskDescription}
            onChange={(e) => setEditTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateTask}
            color="primary"
            variant="contained"
            disabled={loadingTaskUpdate}
            startIcon={loadingTaskUpdate ? <CircularProgress size={20} /> : null}
          >
            {loadingTaskUpdate ? "Đang cập nhật..." : "Cập nhật Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalTask;
