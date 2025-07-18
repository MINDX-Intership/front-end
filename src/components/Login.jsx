import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Login.css';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:3000/api/accounts/login', {
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
        // Optionally, store token or user data and redirect to homepage
        setCurrentPage('/homepage'); // Redirect to homepage on successful login
      } else {
        console.error('Login failed:', data);
        setError(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column',  alignItems: 'center',  bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1, }}>
        <Typography component="h1" variant="h5" color="primary">
          Đăng Nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate  sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Đăng Nhập
          </Button>
          <Link href="/register"onClick={(e) => {
            e.preventDefault();
            setCurrentPage('/register');}}
            sx={{ color: '#4a90e2', textDecoration: 'none', }}>
            {"Chưa có tài khoản? Đăng ký"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
