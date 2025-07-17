import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Login.css';

const ResetPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login:', { email, password });
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

export default ResetPassword;