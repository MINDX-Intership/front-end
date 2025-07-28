import React, { useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, List, ListItemButton, ListItemText, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './AdminReport.css';

export default function AdminReport() {
  const [selected, setSelected] = useState('overview');
  const handleSelect = (key) => () => setSelected(key);
  const renderSummaryTable = (title) => (
    <Paper elevation={0} className="report-table-paper">
      <div className="chart-placeholder">
        <div className="chart-label">Biểu đồ tổng quan dự án (placeholder)</div>
      </div>
      <div className="report-title">{title}</div>
      <Table size="medium" className="big-table">
        <TableHead>
          <TableRow>
            <TableCell>Danh mục</TableCell>
            <TableCell>Hoàn thành</TableCell>
            <TableCell>Đang thực hiện</TableCell>
            <TableCell>Chờ xử lý</TableCell>
            <TableCell>Tỷ lệ thành công</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} align="center" style={{ color: '#a7a7a7' }}>
              Chưa có dữ liệu
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
  const renderDetailTable = () => (
    <Paper elevation={0} className="report-table-paper">
      <div className="report-title">Báo Cáo Chi Tiết</div>
      <Table size="medium" className="big-table">
        <TableHead>
          <TableRow>
            <TableCell>Mã dự án</TableCell>
            <TableCell>Tên dự án</TableCell>
            <TableCell>Người phụ trách</TableCell>
            <TableCell>Tiến độ</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hạn chót</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} align="center" style={{ color: '#a7a7a7' }}>
              Chưa có dữ liệu dự án
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
  const renderSelectedTable = () => {
    switch (selected) {
      case 'overview':
        return renderSummaryTable('Báo Cáo Tổng Quan');
      case 'detail':
        return renderDetailTable();
      case 'performance':
        return renderSummaryTable('Phân Tích Hiệu Suất');
      case 'progress':
        return renderSummaryTable('Tiến Độ Dự Án');
      default:
        return null;
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
            <ListItemButton selected={selected === 'overview'} onClick={handleSelect('overview')} className="black-white-list">
              <ListItemText primary="Báo cáo tổng quan" />
            </ListItemButton>
            <Divider />
            <ListItemButton selected={selected === 'detail'} onClick={handleSelect('detail')} className="black-white-list">
              <ListItemText primary="Báo cáo chi tiết" />
            </ListItemButton>
            <Divider />
            <ListItemButton selected={selected === 'performance'} onClick={handleSelect('performance')} className="black-white-list">
              <ListItemText primary="Phân tích hiệu suất" />
            </ListItemButton>
            <Divider />
            <ListItemButton selected={selected === 'progress'} onClick={handleSelect('progress')} className="black-white-list">
              <ListItemText primary="Tiến độ dự án" />
            </ListItemButton>
          </List>
        </AccordionDetails>
      </Accordion>
      <Box className="report-content">{renderSelectedTable()}</Box>
    </Box>
  );
}
