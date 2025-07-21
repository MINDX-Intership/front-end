// Login.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Login.css';
import { toast } from 'react-toastify'; // Import toast

const Login = ({ setCurrentPage, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState(''); // Remove error state

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setError(''); // Remove setError

    try {
      const response = await fetch('http://localhost:3000/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        console.log('Token received for login success:', data.token);
        onLoginSuccess(data.token, data.account);
        toast.success("Đăng nhập thành công!"); // Add success toast
      } else {
        console.error('Login failed:', data);
        toast.error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'); // Use toast.error
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.'); // Use toast.error
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#f9f9f9',
          p: 4,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography component="h1" variant="h5" color="primary">
          Đăng Nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* Remove Typography error display
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Đăng Nhập
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
            <Link
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('/register');
              }}
              sx={{ color: '#4a90e2', textDecoration: 'none' }}
            >
              {"Chưa có tài khoản? Đăng ký"}
            </Link>
            <Link
              href="/reset-password"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('/reset-password');
              }}
              sx={{ color: '#4a90e2', textDecoration: 'none' }}
            >
              {"Quên mật khẩu?"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;