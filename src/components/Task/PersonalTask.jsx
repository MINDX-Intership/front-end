// PersonalTask.jsx
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

function PersonalTask({ authToken, setCurrentPage }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
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

  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      showSnackbar("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.", "error");
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/sprint/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Không thể tải danh sách sprint");

      const data = await response.json();
      const sprintArray = data.sprints;
      if (Array.isArray(sprintArray)) {
        setSprints(sprintArray);
        setSelectedSprintId(sprintArray[0]?._id || "");
      } else {
        showSnackbar("Dữ liệu trả về không hợp lệ.", "error");
        setSprints([]);
        setSelectedSprintId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sprint:", err);
      setError(err);
      showSnackbar("Lỗi khi tải danh sách sprint. Vui lòng thử lại.", "error");
    } finally {
      setLoadingSprints(false);
    }
  }, [authToken, showSnackbar]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setTaskTitle("");
    setTaskDescription("");
    setSelectedSprintId(sprints[0]?._id || "");
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !selectedSprintId) {
      showSnackbar("Vui lòng điền Tiêu đề và chọn Sprint.", "warning");
      return;
    }

    setLoadingTaskCreation(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/task/sprint/${selectedSprintId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          // chỉ gửi đúng những field backend cần
          body: JSON.stringify({
            title: taskTitle,
            description: taskDescription,
            // priority & dueDate nếu có, backend dùng default nếu không gửi
            // assignedTo: bỏ, backend tự gán creator
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

  if (loadingSprints) {
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
          Đang tải danh sách Sprint...
        </Typography>
      </Box>
    );
  }

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
          Đã xảy ra lỗi khi tải sprint: {error.message || "Lỗi không xác định"}
        </Typography>
        <Button variant="contained" onClick={fetchSprints} sx={{ mt: 2 }}>
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
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mô tả Task"
            fullWidth
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Chọn Sprint"
            fullWidth
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary" variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleCreateTask}
            color="primary"
            variant="contained"
            disabled={loadingTaskCreation || !sprints.length || !taskTitle}
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
