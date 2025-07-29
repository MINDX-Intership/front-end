import React, { useState, useEffect, useMemo } from 'react'; // Thêm useMemo
import './AdminTimeline.css';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  List, // Thêm List, ListItem
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip // Thêm Chip cho trạng thái
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icon cho trạng thái "NOT_STARTED"
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; // Icon cho trạng thái "IN_PROGRESS"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon cho trạng thái "OVERDUE"
import DoneAllIcon from '@mui/icons-material/DoneAll'; // Icon cho trạng thái "COMPLETED"


const AdminTimeline = ({ authToken }) => {
  const [tab, setTab] = useState(0);
  const [timelineTasks, setTimelineTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDate = "15/01/2024"; // Đây là các giá trị tĩnh, bạn có thể muốn tính toán động
  const endDate = "25/02/2024";
  const ganttDates = ["15/01", "22/01", "29/01", "05/02", "12/02", "19/02", "25/02"];

  useEffect(() => {
    const fetchTimelineTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!authToken) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        // CHẮC CHẮN RẰNG URL NÀY LÀ ĐẦY ĐỦ VÀ CHÍNH XÁC NHƯ POSTMAN CỦA BẠN
        const response = await fetch('http://localhost:3000/api/admin/timeline-tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json(); // Cố gắng parse JSON ngay cả khi lỗi
          throw new Error(errorData.message || `Failed to fetch timeline tasks: ${response.status}`);
        }

        const data = await response.json();
        setTimelineTasks(data.data);
      } catch (err) {
        console.error("Error fetching timeline tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineTasks();
  }, [authToken]);

  // Tính toán số liệu thống kê cho tab phân tích
  const totalTasks = timelineTasks.length;
  const completedTasks = timelineTasks.filter(task => task.status === 'COMPLETED').length;
  const inProgressTasks = timelineTasks.filter(task => task.status === 'IN_PROGRESS').length;
  const averageProgress = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  // Sắp xếp các nhiệm vụ theo ngày tạo mới nhất (hoặc ngày bắt đầu/kết thúc nếu có)
  const sortedTasks = useMemo(() => {
    return [...timelineTasks].sort((a, b) => {
      // Giả sử có thuộc tính `createdAt` là chuỗi ngày ISO 8601
      // Bạn có thể thay đổi để sắp xếp theo ngày bắt đầu (startDate) hoặc ngày kết thúc (endDate) nếu chúng có sẵn
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần (mới nhất trước)
    });
  }, [timelineTasks]);

  // Hàm để định dạng ngày
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Hàm để lấy icon và màu cho trạng thái
  const getStatusDisplay = (status) => {
    let icon = null;
    let color = '';
    let label = '';

    switch (status) {
      case 'COMPLETED':
        icon = <DoneAllIcon fontSize="small" />;
        color = 'success';
        label = 'Hoàn thành';
        break;
      case 'IN_PROGRESS':
        icon = <HourglassEmptyIcon fontSize="small" />;
        color = 'info';
        label = 'Đang thực hiện';
        break;
      case 'NOTSTARTED':
        icon = <AccessTimeIcon fontSize="small" />;
        color = 'default'; // Hoặc 'secondary'
        label = 'Chưa bắt đầu';
        break;
      case 'OVERDUE':
        icon = <HighlightOffIcon fontSize="small" />;
        color = 'error';
        label = 'Quá hạn';
        break;
      default:
        icon = null;
        color = 'default';
        label = status;
    }
    return <Chip label={label} icon={icon} color={color} size="small" />;
  };


  return (
    <Box className="admin-timeline-root">
      <Box className="tab-container">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          TabIndicatorProps={{ style: { display: 'none' } }}
          className="simple-tabs"
        >
          <Tab
            label="Xem Timeline"
            className={tab === 0 ? 'tab-selected' : ''}
          />
          <Tab
            label="Phân tích Timeline"
            className={tab === 1 ? 'tab-selected' : ''}
          />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box className="cards-wrapper">
          <Paper elevation={3} className="custom-card gantt-paper">
            <Box className="gantt-title-row">
              <Typography className="card-title">Biểu Đồ Timeline Gantt</Typography>
              <Box className="gantt-date-row">
                <Typography className="gantt-date">{startDate} - {endDate}</Typography>
              </Box>
            </Box>
            <Divider className="divider" />
            <Box className="gantt-dates">
              {ganttDates.map(date => (
                <Box key={date} className="gantt-date-label">{date}</Box>
              ))}
            </Box>
            {loading && <Typography>Đang tải nhiệm vụ timeline...</Typography>}
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {!loading && !error && timelineTasks.length === 0 ? (
              <Box className="empty-state gantt-empty">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-title">Chưa có nhiệm vụ nào</div>
                <Typography className="empty-state-caption">
                  Nhấn "Tạo nhiệm vụ mới" để bắt đầu
                </Typography>
              </Box>
            ) : (
              <Box className="gantt-content">
                {/* Đây là nơi bạn sẽ hiển thị biểu đồ Gantt thực tế hoặc danh sách nhiệm vụ đã sắp xếp */}
                <Typography variant="h6" sx={{ mb: 2 }}>Các nhiệm vụ đã tải (Sắp xếp theo ngày tạo mới nhất):</Typography>
                <List dense>
                  {sortedTasks.map(task => (
                    <ListItem key={task._id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {task.title}
                            </Typography>
                            {getStatusDisplay(task.status)}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Mô tả: {task.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ưu tiên: {task.priority}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ngày tạo: {formatDate(task.createdAt)}
                            </Typography>
                            {task.sprint && (
                                <Typography variant="body2" color="text.secondary">
                                    Sprint ID: {task.sprint}
                                </Typography>
                            )}
                             {task.departId && (
                                <Typography variant="body2" color="text.secondary">
                                    Phòng ban ID: {task.departId}
                                </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>

          <Paper elevation={3} className="custom-card calendar-paper">
            <Box className="calendar-title-row">
              <Typography className="card-title">Biểu Đồ Timeline Lịch</Typography>
              <Button size="small" className="calendar-btn">Xem theo tuần</Button>
            </Box>
            <Divider className="divider" />
            {loading && <Typography>Đang tải nhiệm vụ lịch...</Typography>}
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {!loading && !error && timelineTasks.length === 0 ? (
              <Box className="empty-state calendar-empty">
                <div className="empty-state-icon">⏰</div>
                <div className="empty-state-title">Timeline trống</div>
                <Typography className="empty-state-caption">
                  Tạo nhiệm vụ để xem lịch timeline
                </Typography>
              </Box>
            ) : (
              <Box className="calendar-content">
                <Typography variant="h6" sx={{ mb: 2 }}>Chế độ xem lịch cho nhiệm vụ:</Typography>
                <List dense>
                  {sortedTasks.map(task => (
                    <ListItem key={task._id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {task.title}
                            </Typography>
                            {getStatusDisplay(task.status)}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Ngày tạo: {formatDate(task.createdAt)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Mô tả: {task.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {tab === 1 && (
        <Paper elevation={3} className="custom-card analysis-paper">
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tổng nhiệm vụ</Typography>
                <Typography className="stat-value">{totalTasks}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Hoàn thành</Typography>
                <Typography className="stat-value">
                  {completedTasks} <CheckCircleIcon color="success" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Đang thực hiện</Typography>
                <Typography className="stat-value">
                  {inProgressTasks} <PlayCircleIcon color="info" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tiến độ trung bình</Typography>
                <Typography className="stat-value">{averageProgress}%</Typography>
              </Box>
            </Grid>
          </Grid>
          {loading && <Typography>Đang tính toán dữ liệu phân tích...</Typography>}
          {error && <Typography color="error">Lỗi: {error}</Typography>}
          {!loading && !error && totalTasks === 0 ? (
            <Box className="empty-state analysis-empty">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">Chưa có dữ liệu để phân tích</div>
              <Typography className="empty-state-caption">
                Tạo nhiệm vụ để xem biểu đồ phân tích
              </Typography>
            </Box>
          ) : (
            <Box className="analysis-content">
              <Typography variant="h6">Dữ liệu phân tích:</Typography>
              <p>Tổng nhiệm vụ: {totalTasks}</p>
              <p>Hoàn thành: {completedTasks}</p>
              <p>Đang thực hiện: {inProgressTasks}</p>
              <p>Tiến độ trung bình: {averageProgress}%</p>
              {/* Bạn có thể thêm các biểu đồ hoặc thông tin chi tiết khác ở đây */}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdminTimeline;