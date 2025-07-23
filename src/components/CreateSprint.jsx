import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';

const FormContainer = styled(Box)(() => ({
  marginTop: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
}));

const CreateSprint = ({ authToken }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // Changed from 'describe' to 'description'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!title || !startDate || !endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin: Tiêu đề, Ngày bắt đầu, Ngày kết thúc.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/sprint/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          describe: description, // Changed to 'describe' to match backend Sprints.Controller.js
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Sprint đã được tạo thành công!');
        // Optionally, clear the form or redirect
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
      } else {
        toast.error(data.message || 'Tạo sprint thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo sprint:', error);
      toast.error('Lỗi mạng hoặc lỗi không mong muốn khi tạo sprint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <FormContainer>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Tạo Sprint Mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Tiêu đề Sprint"
            name="title"
            autoComplete="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Mô tả"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="startDate"
            label="Ngày Bắt Đầu"
            name="startDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="endDate"
            label="Ngày Kết Thúc"
            name="endDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 10, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo Sprint'}
          </Button>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default CreateSprint;