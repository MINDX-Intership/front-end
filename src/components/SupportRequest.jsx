import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./SupportRequest.css";

const STATUS_OPTIONS = [
  { value: "new", label: "Mới" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "resolved", label: "Hoàn thành" },
];

export default function SupportRequest() {
  const [requests, setRequests] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  // Form fields
  const [code, setCode] = useState(""); // ví dụ ST-QLTC11
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Lọc danh sách theo search & filter status
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, filterStatus]);

  // Thêm yêu cầu hỗ trợ mới
  const addRequest = () => {
    if (!code.trim() || !title.trim()) {
      alert("Vui lòng nhập mã yêu cầu và tiêu đề");
      return;
    }
    setRequests((prev) => [
      { id: Date.now(), code: code.trim(), title: title.trim(), description: description.trim(), status },
      ...prev,
    ]);
    setOpenForm(false);
    setCode("");
    setTitle("");
    setDescription("");
    setStatus("new");
  };

  // Xóa yêu cầu theo id
  const deleteRequest = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa yêu cầu này không?")) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <Box className="supportRequestContainer" sx={{ maxWidth: 900, mx: "auto", p: 3, fontFamily: "Arial" }}>
      <Typography variant="h4" textAlign="center" mb={3} className="supportTitle">
        Quản lý Yêu cầu Hỗ trợ
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems="center">
        <TextField
          size="small"
          placeholder="Tìm kiếm theo mã hoặc tiêu đề"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 350 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filterStatus}
            label="Trạng thái"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Gửi yêu cầu hỗ trợ
        </Button>
      </Stack>

      {/* Danh sách yêu cầu */}
      {filteredRequests.length === 0 ? (
        <Paper elevation={1} className="emptyListBox">
          <Typography>Chưa có yêu cầu hỗ trợ phù hợp</Typography>
        </Paper>
      ) : (
        <Stack spacing={2} className="requestList">
          {filteredRequests.map(({ id, code, title, description, status }) => (
            <Paper key={id} className={`requestCard status-${status}`} elevation={2}>
              <Box className="requestHeader">
                <Typography variant="subtitle1" className="requestCode">{code}</Typography>
                <IconButton edge="end" color="error" onClick={() => deleteRequest(id)} size="large" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" className="requestTitle">{title}</Typography>
              {description && <Typography className="requestDescription">{description}</Typography>}
              <Typography className="requestStatus">
                Trạng thái: <strong>{STATUS_OPTIONS.find((s) => s.value === status)?.label}</strong>
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Form gửi yêu cầu */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Gửi Yêu Cầu Hỗ Trợ Mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Tên yêu cầu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              autoFocus
              placeholder="Tên yêu cầu"
            />
            <TextField
              label="Tiêu đề yêu cầu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Mô tả chi tiết"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Mô tả ngắn gọn nội dung yêu cầu"
            />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Hủy</Button>
          <Button variant="contained" onClick={addRequest}>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

