import React, { useState, useEffect } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, List, ListItemButton, ListItemText, Divider, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './AdminReport.css';

export default function AdminReport({ authToken }) {
  const [selected, setSelected] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = 'http://localhost:3000/api/reports';
  const endpoints = {
    overview: `${baseURL}/overview`,
    detail: `${baseURL}/detailed`,
    performance: `${baseURL}/performance`,
    progress: `${baseURL}/projects/progress`,
  };

  const handleSelect = (key) => () => setSelected(key);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(endpoints[selected], {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `Error ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) fetchReport();
  }, [selected, authToken]);

  const renderOverview = () => {
    if (!data?.overview) return null;
    const { employees, tasks, projects, sprints } = data.overview;
    return (
      <Paper elevation={0} className="report-table-paper">
        <Typography className="report-title">Báo Cáo Tổng Quan</Typography>
        <Table size="medium" className="big-table">
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Hoạt động/Hoàn thành</TableCell>
              <TableCell>Tỷ lệ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>{employees.total}</TableCell>
              <TableCell>{employees.active}</TableCell>
              <TableCell>{employees.utilizationRate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Công việc</TableCell>
              <TableCell>{tasks.total}</TableCell>
              <TableCell>{tasks.completed}</TableCell>
              <TableCell>{tasks.completionRate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dự án</TableCell>
              <TableCell>{projects.total}</TableCell>
              <TableCell>{projects.active}</TableCell>
              <TableCell>{projects.progress.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sprint</TableCell>
              <TableCell>{sprints.total}</TableCell>
              <TableCell>{sprints.active}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const renderDetail = () => {
    const items = data?.detailed || [];
    return (
      <Paper elevation={0} className="report-table-paper">
        <Typography className="report-title">Báo Cáo Chi Tiết</Typography>
        <Table size="medium" className="big-table">
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Phụ trách</TableCell>
              <TableCell>Tiến độ</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hạn chót</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? items.map((proj) => (
              <TableRow key={proj.id || proj._id}>
                <TableCell>{proj.id || proj._id}</TableCell>
                <TableCell>{proj.name}</TableCell>
                <TableCell>{proj.owner}</TableCell>
                <TableCell>{proj.progress}</TableCell>
                <TableCell>{proj.status}</TableCell>
                <TableCell>{proj.deadline}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ color: '#a7a7a7' }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const renderPerformance = () => {
    const perfList = data?.performance || [];
    const summary = data?.summary || {};
    return (
      <Paper elevation={0} className="report-table-paper">
        <Typography className="report-title">Phân Tích Hiệu Suất</Typography>
        <Table size="medium" className="big-table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Tổng CP</TableCell>
              <TableCell>Hoàn thành</TableCell>
              <TableCell>Đúng hạn</TableCell>
              <TableCell>Trễ hạn</TableCell>
              <TableCell>Tỷ lệ hoàn thành</TableCell>
              <TableCell>Tỷ lệ đúng hạn</TableCell>
              <TableCell>Điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perfList.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.personalEmail}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.roleTag}</TableCell>
                <TableCell>{item.totalTasks}</TableCell>
                <TableCell>{item.completedTasks}</TableCell>
                <TableCell>{item.onTimeTasks}</TableCell>
                <TableCell>{item.overdueTasks}</TableCell>
                <TableCell>{item.completionRate}%</TableCell>
                <TableCell>{item.onTimeRate}%</TableCell>
                <TableCell>{item.performanceScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={2} p={2}>
          <Typography variant="subtitle1">Tổng nhân viên: {summary.totalEmployees}</Typography>
          <Typography variant="subtitle1">Tỷ lệ hoàn thành TB: {summary.averageCompletionRate}%</Typography>
          <Typography variant="subtitle1">Tỷ lệ đúng hạn TB: {summary.averageOnTimeRate}%</Typography>
        </Box>
      </Paper>
    );
  };

  const renderProgress = () => {
    const prog = data?.projectProgress || data?.projects || {};
    return (
      <Paper elevation={0} className="report-table-paper">
        <Typography className="report-title">Tiến Độ Dự Án</Typography>
        <pre>{JSON.stringify(prog, null, 2)}</pre>
      </Paper>
    );
  };

  const renderSelected = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    switch (selected) {
      case 'overview': return renderOverview();
      case 'detail': return renderDetail();
      case 'performance': return renderPerformance();
      case 'progress': return renderProgress();
      default: return null;
    }
  };

  return (
    <Box className="admin-report-container">
      <Accordion defaultExpanded className="report-accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" className="black-white-text">Chức năng</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List disablePadding>
            {['overview','detail','performance','progress'].map((key, idx) => (
              <React.Fragment key={key}>
                <ListItemButton selected={selected === key} onClick={handleSelect(key)} className="black-white-list">
                  <ListItemText primary={{overview: 'Báo cáo tổng quan', detail: 'Báo cáo chi tiết', performance: 'Phân tích hiệu suất', progress: 'Tiến độ dự án'}[key]} />
                </ListItemButton>
                {idx < 3 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Box className="report-content">{renderSelected()}</Box>
    </Box>
  );
}
