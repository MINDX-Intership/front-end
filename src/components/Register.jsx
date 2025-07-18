import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Register.css';

const Register = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(''); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          name,
          age: parseInt(age), 
          phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        // Optionally, redirect to login page or show a success message
        setCurrentPage('/login');
      } else {
        console.error('Registration failed:', data);
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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
          Đăng Ký
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="name" label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField margin="normal" required fullWidth id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth id="age" label="Tuổi" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          <TextField margin="normal" required fullWidth id="phone" label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField margin="normal" required fullWidth id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField margin="normal" required fullWidth id="confirmPassword" label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> {/* Confirm password field */}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Đăng Ký
          </Button>
          <Link href="/login" onClick={(e) => {
            e.preventDefault();
            setCurrentPage('/login');}} 
            sx={{ color: '#4a90e2', textDecoration: 'none',}}>
            {"Đã có tài khoản? Đăng nhập"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
