import React from 'react';
import './AdminTimeline.css';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const AdminTimeline = () => {
  const [tab, setTab] = React.useState(0);

  const startDate = "15/01/2024";
  const endDate = "25/02/2024";
  const ganttDates = ["15/01", "22/01", "29/01", "05/02", "12/02", "19/02", "25/02"];

  return (
    <Box className="admin-timeline-root">
      {/* Thanh điều hướng đơn giản, không icon */}
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

      {/* Nội dung tab */}
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
            <Box className="empty-state gantt-empty">
              <div className="empty-state-icon">📅</div>
              <div className="empty-state-title">Chưa có nhiệm vụ nào</div>
              <Typography className="empty-state-caption">
                Nhấn "Tạo nhiệm vụ mới" để bắt đầu
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={3} className="custom-card calendar-paper">
            <Box className="calendar-title-row">
              <Typography className="card-title">Biểu Đồ Timeline Lịch</Typography>
              <Button size="small" className="calendar-btn">Xem theo tuần</Button>
            </Box>
            <Divider className="divider" />
            <Box className="empty-state calendar-empty">
              <div className="empty-state-icon">⏰</div>
              <div className="empty-state-title">Timeline trống</div>
              <Typography className="empty-state-caption">
                Tạo nhiệm vụ để xem lịch timeline
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {tab === 1 && (
        <Paper elevation={3} className="custom-card analysis-paper">
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tổng nhiệm vụ</Typography>
                <Typography className="stat-value">0</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Hoàn thành</Typography>
                <Typography className="stat-value">
                  0 <CheckCircleIcon color="action" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Đang thực hiện</Typography>
                <Typography className="stat-value">
                  0 <PlayCircleIcon color="action" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tiến độ trung bình</Typography>
                <Typography className="stat-value">0%</Typography>
              </Box>
            </Grid>
          </Grid>
          <Box className="empty-state analysis-empty">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">Chưa có dữ liệu để phân tích</div>
            <Typography className="empty-state-caption">
              Tạo nhiệm vụ để xem biểu đồ phân tích
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AdminTimeline;
