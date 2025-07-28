import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./Admin.css";

// --- FunctionList Component ---
const FunctionList = ({ onSelectFunction }) => {
  const [open, setOpen] = useState(false);
  const [openDept, setOpenDept] = useState(false);

  const toggleOpen = () => setOpen(!open);
  const toggleOpenDept = () => setOpenDept(!openDept);

  const subFunctions = [
    { key: 'personalInfo', title: 'Quản lý thông tin cá nhân', desc: 'Chỉnh sửa thông tin cá nhân' },
    { key: 'jobInfo', title: 'Quản lý thông tin công việc', desc: 'Quản lý thông tin công việc' },
    { key: 'workSchedule', title: 'Quản lý lịch làm việc', desc: 'Quản lý lịch làm việc' },
    { key: 'accountInfo', title: 'Quản lý tài khoản', desc: 'Quản lý tài khoản nhân viên' },
  ];

  return (
    <Box className="function-list-box">
      <List>
        <ListItem
          button
          onClick={toggleOpen}
          className={`sub-function-item ${open ? "active" : ""}`}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <PeopleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography className="func-title">Danh sách nhân viên</Typography>}
            secondary={<Typography className="func-desc">Hiển thị danh sách tất cả nhân viên trong hệ thống</Typography>}
          />
          {open
            ? <KeyboardArrowDownIcon color="primary" />
            : <KeyboardArrowRightIcon color="primary" />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="MuiCollapse-root">
            <ListItem
              button
              className="sub-function-item"
              onClick={() => onSelectFunction(null)}
            >
              <Box className="item-content" sx={{ width: '100%' }}>
                <Typography className="func-title">Xem danh sách</Typography>
                <Typography className="func-desc">Xem và quản lý danh sách nhân viên</Typography>
              </Box>
            </ListItem>
            {subFunctions.map((sf) => (
              <ListItem
                button
                key={sf.key}
                className="sub-function-item"
                onClick={() => onSelectFunction(sf.key)}
              >
                <Box className="item-content" sx={{ width: '100%' }}>
                  <Typography className="func-title">{sf.title}</Typography>
                  <Typography className="func-desc">{sf.desc}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem
          button
          onClick={toggleOpenDept}
          className={`sub-function-item ${openDept ? "active" : ""}`}
          sx={{ mb: 1, mt: 2 }}
        >
          <ListItemIcon>
            <BusinessIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography className="func-title">Phòng ban</Typography>}
            secondary={<Typography className="func-desc">Tạo và quản lý phòng ban</Typography>}
          />
          {openDept
            ? <KeyboardArrowDownIcon color="primary" />
            : <KeyboardArrowRightIcon color="primary" />}
        </ListItem>
        <Collapse in={openDept} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="MuiCollapse-root">
            <ListItem
              button
              className="sub-function-item"
              onClick={() => onSelectFunction('addDepartment')}
            >
              <Box className="item-content" sx={{ width: '100%' }}>
                <Typography className="func-title">Tạo phòng ban</Typography>
                <Typography className="func-desc">Thêm mới phòng ban vào hệ thống</Typography>
              </Box>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

// --- Admin Component ---
const Admin = ({ authToken }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rolesInput, setRolesInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State for department form
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentDesc, setDepartmentDesc] = useState("");

  // Fetch all employees on mount
  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setEmployees(data.users || []);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách nhân viên.");
      })
      .finally(() => setLoading(false));
  }, [authToken]);

  const handleSelectFunction = (key) => {
    setActiveForm(key);
    // Scroll to the bottom to show the form if it appears at the bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      (emp.accountId && emp.accountId.email || "").toLowerCase().includes(term) ||
      (emp.roleTag || "").toLowerCase().includes(term)
    );
  });

  const grantUserAccess = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/access-control/grant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            roles: rolesInput.split(',').map(role => role.trim()), // Split roles by comma and trim whitespace
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cấp quyền thất bại");
      setSuccessMessage("Cấp quyền thành công");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  const updateUserAccess = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/access-control/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            roles: rolesInput.split(',').map(role => role.trim()),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cập nhật quyền thất bại");
      setSuccessMessage("Cập nhật quyền thành công");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  const deleteUserAccess = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/access-control/delete/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xóa quyền thất bại");
      setSuccessMessage("Xóa quyền thành công");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  // --- New Function: Add Department ---
  const addDepartment = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/departs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: departmentName,
          code: departmentCode,
          describe: departmentDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Tạo phòng ban thất bại");
      setSuccessMessage("Tạo phòng ban thành công!");
      // Clear form fields
      setDepartmentName("");
      setDepartmentCode("");
      setDepartmentDesc("");
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
    }
  };

  const renderEmployeeList = () => {
    if (loading) return <CircularProgress />;
    if (error && !activeForm) return <Alert severity="error">{error}</Alert>;
    if (!filteredEmployees.length && !loading)
      return <Typography>Không tìm thấy nhân viên nào.</Typography>;

    return (
      <List>
        {filteredEmployees.map((emp) => (
          <ListItem
            key={emp._id}
            divider
            alignItems="flex-start"
            sx={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box>
                <Typography fontWeight="bold">{emp.name}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <EmailIcon fontSize="small" /> {emp.accountId ? emp.accountId.email : 'N/A'}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <BadgeIcon fontSize="small" /> {emp.roleTag || "Chưa có"}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    setRolesInput(emp.roleTag || "");
                    const role = prompt(
                      "Nhập danh sách role mới (cách nhau bởi dấu phẩy):",
                      emp.roleTag || ""
                    );
                    if (role !== null) {
                      setRolesInput(role);
                      updateUserAccess();
                    }
                  }}
                >
                  Cập nhật
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    if (
                      window.confirm(
                        `Bạn có chắc muốn xóa quyền của ${emp.name}?`
                      )
                    ) {
                      deleteUserAccess();
                    }
                  }}
                >
                  Xóa quyền
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    const role = prompt(
                      "Nhập roles để cấp quyền (cách nhau bởi dấu phẩy):"
                    );
                    if (role !== null) {
                      setRolesInput(role);
                      grantUserAccess();
                    }
                  }}
                >
                  Cấp quyền
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeForm === 'addDepartment') {
      addDepartment();
    } else {
      alert('Đã gửi form!'); // For other generic forms
    }
    setActiveForm(null); // Go back to the main list after submission
  };

  const handleCancel = () => {
    setActiveForm(null);
    // Clear department form fields on cancel
    setDepartmentName("");
    setDepartmentCode("");
    setDepartmentDesc("");
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'add':
        return (
          <Box
            key="form-add"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thêm nhân viên mới
            </Typography>
            <TextField label="Họ và tên" name="fullName" fullWidth size="small" margin="normal" required />
            <TextField label="Email" name="email" type="email" fullWidth size="small" margin="normal" required />
            <TextField label="Số điện thoại" name="phone" type="tel" fullWidth size="small" margin="normal" />
            <TextField label="Chức vụ" name="position" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'personalInfo':
        return (
          <Box
            key="form-personalInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý thông tin cá nhân
            </Typography>
            <TextField label="Họ và tên" name="fullName" fullWidth size="small" margin="normal" required />
            <TextField label="Ngày sinh" name="dob" type="date" fullWidth size="small" margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Địa chỉ" name="address" fullWidth size="small" margin="normal" />
            <TextField label="Số CMND/CCCD" name="idNumber" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'jobInfo':
        return (
          <Box
            key="form-jobInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý thông tin công việc
            </Typography>
            <TextField label="Chức danh" name="title" fullWidth size="small" margin="normal" required />
            <TextField label="Phòng ban" name="department" fullWidth size="small" margin="normal" />
            <TextField label="Ngày bắt đầu" name="startDate" type="date" fullWidth size="small" margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Trạng thái làm việc" name="status" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'workSchedule':
        return (
          <Box
            key="form-workSchedule"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý lịch làm việc
            </Typography>
            <TextField
              label="Thời gian làm việc bắt đầu"
              name="workStart"
              type="time"
              fullWidth
              size="small"
              margin="normal"
              defaultValue="09:00"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Thời gian làm việc kết thúc"
              name="workEnd"
              type="time"
              fullWidth
              size="small"
              margin="normal"
              defaultValue="18:00"
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Ca làm việc" name="shift" fullWidth size="small" margin="normal" />
            <TextField label="Ghi chú" name="notes" multiline rows={3} fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'accountInfo':
        return (
          <Box
            key="form-accountInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý tài khoản nhân viên
            </Typography>
            <TextField label="Tên đăng nhập" name="username" fullWidth size="small" margin="normal" required />
            <TextField label="Email liên kết" name="email" type="email" fullWidth size="small" margin="normal" />
            <TextField label="Mật khẩu mới" name="password" type="password" fullWidth size="small" margin="normal" />
            <TextField label="Quyền hạn" name="role" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'addDepartment':
        return (
          <Box
            key="form-addDepartment"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit} // This will now call `addDepartment`
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tạo phòng ban mới
            </Typography>
            <TextField
              label="Tên phòng ban"
              name="departmentName"
              fullWidth size="small" margin="normal"
              required
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <TextField
              label="Mã phòng ban"
              name="departmentCode"
              fullWidth size="small" margin="normal"
              required
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
            />
            <TextField
              label="Miêu tả"
              name="departmentDesc"
              fullWidth size="small" margin="normal"
              multiline
              rows={3}
              value={departmentDesc}
              onChange={(e) => setDepartmentDesc(e.target.value)}
            />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };


  return (
    <Box className="container-main">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Hệ thống Quản lý Nhân viên
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        AD-QLTT01
      </Typography>

      {/* Admin Functions Section */}
      <Box className="function-container">
        <FunctionList onSelectFunction={handleSelectFunction} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => handleSelectFunction('add')}
          className="add-employee-btn"
          sx={{ mt: 3, mb: 1, width: '100%' }}
        >
          Thêm mới nhân viên
        </Button>
      </Box>

      {/* Display Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Conditional Rendering of Forms or Employee List */}
      {activeForm ? (
        renderForm()
      ) : (
        <>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ mt: 3 }}
          >
            Danh sách nhân viên
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Quản lý thông tin tất cả nhân viên trong hệ thống
          </Typography>
          <Box
            className="search-row"
            mb={2}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                // Filtering happens automatically with `searchTerm` state
              }}
            >
              Lọc
            </Button>
          </Box>
          {renderEmployeeList()}
        </>
      )}
    </Box>
  );
};

export default Admin;