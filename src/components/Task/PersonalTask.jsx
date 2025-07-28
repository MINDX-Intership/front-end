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
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { AddCircleOutline as AddCircleOutlineIcon } from "@mui/icons-material";

const API_BASE_URL = "http://localhost:3000/api";
const LOADING_DELAY_MS = 2000; // 2-second delay

function PersonalTask({ authToken, setCurrentPage, currentUserId }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedDepartId, setSelectedDepartId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingTaskCreation, setLoadingTaskCreation] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const theme = useTheme();

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // --- Utility for adding delay ---
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // --- Fetch Sprints ---
  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      showSnackbar("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.", "error");
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/sprints/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách sprint");
      }

      const data = await response.json();
      const sprintArray = data.sprints; // Assuming 'sprints' is the key for sprint data
      if (Array.isArray(sprintArray)) {
        setSprints(sprintArray);
        setSelectedSprintId(sprintArray[0]?._id || "");
      } else {
        showSnackbar("Dữ liệu sprint trả về không hợp lệ.", "error");
        setSprints([]);
        setSelectedSprintId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sprint:", err);
      setError(err);
      showSnackbar(`Lỗi khi tải danh sách sprint: ${err.message}`, "error");
    } finally {
      // Delay before setting loading to false
      await delay(LOADING_DELAY_MS);
      setLoadingSprints(false);
    }
  }, [authToken, showSnackbar]);

  // --- Fetch Departments ---
  const fetchDepartments = useCallback(async () => {
    if (!authToken) {
      showSnackbar("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.", "error");
      setLoadingDepartments(false);
      return;
    }

    setLoadingDepartments(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/departs/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách phòng ban");
      }

      const responseData = await response.json(); // Use a different variable name to avoid confusion
      // --- IMPORTANT CHANGE HERE: Accessing 'data' field ---
      const departmentArray = responseData.data; // Now correctly accessing the 'data' array
      if (Array.isArray(departmentArray)) {
        setDepartments(departmentArray);
        setSelectedDepartId(departmentArray[0]?._id || "");
      } else {
        showSnackbar("Dữ liệu phòng ban trả về không hợp lệ.", "error");
        setDepartments([]);
        setSelectedDepartId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng ban:", err);
      setError(err);
      showSnackbar(`Lỗi khi tải danh sách phòng ban: ${err.message}`, "error");
    } finally {
      // Delay before setting loading to false
      await delay(LOADING_DELAY_MS);
      setLoadingDepartments(false);
    }
  }, [authToken, showSnackbar]);

  // Fetch data on component mount
  useEffect(() => {
    fetchSprints();
    fetchDepartments();
  }, [fetchSprints, fetchDepartments]);

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
      showSnackbar("Vui lòng điền Tiêu đề, chọn Sprint và Phòng ban.", "warning");
      return;
    }
    if (!currentUserId) {
        showSnackbar("Không thể tạo task: Thông tin người dùng không có sẵn. Vui lòng đăng nhập lại.", "error");
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
            assignees: [currentUserId], // User creates task for themselves
            title: taskTitle,
            description: taskDescription,
          }),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        showSnackbar("Tạo task thành công!", "success");
        handleCloseForm();
      } else {
        showSnackbar(
          `Lỗi khi tạo task: ${data.message || "Lỗi không xác định"}`,
          "error"
        );
      }
    } catch (err) {
      console.error("Lỗi khi tạo task:", err);
      showSnackbar(`Lỗi khi tạo task: ${err.message}`, "error");
    } finally {
      setLoadingTaskCreation(false);
    }
  };

  // Combine loading states for initial render
  if (loadingSprints || loadingDepartments) {
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

  // Handle errors for either fetch operation after initial load attempt
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
        <Button variant="contained" onClick={() => { fetchSprints(); fetchDepartments(); }} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Các Task của bạn
        </Typography>
        <Typography variant="body1" color="text.disabled">
          Danh sách task sẽ được hiển thị ở đây. (Chức năng đang phát triển)
        </Typography>
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

            startIcon={loadingTaskCreation ? <CircularProgress size={20} /> : null}
          >
            {loadingTaskCreation ? "Đang tạo..." : "Tạo Task"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PersonalTask;