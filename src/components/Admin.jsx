import React, { useState } from 'react';
import {
  Box, Typography, List, ListItem,
  ListItemIcon, ListItemText, Collapse,
  Button, TextField
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './Admin.css';

const FunctionList = ({ onSelectFunction }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

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
            primary={
              <Typography className="func-title">
                Danh sách nhân viên
              </Typography>
            }
            secondary={
              <Typography className="func-desc">
                Hiển thị danh sách tất cả nhân viên trong hệ thống
              </Typography>
            }
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
      </List>
    </Box>
  );
};

const Admin = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleSelectFunction = (key) => {
    setActiveForm(key);
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Đã gửi form!');
    setActiveForm(null);
  };

  const handleCancel = () => {
    setActiveForm(null);
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

      {renderForm()}

      {!activeForm && (
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
            Danh sách nhân viên
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Quản lý thông tin tất cả nhân viên trong hệ thống
          </Typography>

          <Box className="search-row">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Tìm kiếm nhân viên..."
            />
            <Button variant="outlined" size="small">Lọc</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Admin;
