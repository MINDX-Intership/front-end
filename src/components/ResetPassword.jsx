import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './ResetPassword.css';

const ResetPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/accounts/reset-password-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
      } else {
        setError(data.message || 'Yêu cầu đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại email.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1, }}>
        <Typography component="h1" variant="h5" color="primary">
          Đặt Lại Mật Khẩu
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {message && (
            <Typography color="success" variant="body2" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Gửi Yêu Cầu
          </Button>
          <Link href="/login" onClick={(e) => {
            e.preventDefault();
            setCurrentPage('/login');
          }}
          sx={{ color: '#4a90e2', textDecoration: 'none', }}>
            {"Quay lại Đăng nhập"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;