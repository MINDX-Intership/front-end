import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';




const FormContainer = styled(Box)(({ }) => ({ 
  marginTop: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)', // Tương đương theme.shadows[1]
}));

const CreateProfile = ({ setCurrentPage, authToken, onProfileCreated }) => {
  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(''); // Date of Birth
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nếu không có token, chuyển hướng về trang đăng nhập
    if (!authToken) {
      setCurrentPage('/login');
    }
  }, [authToken, setCurrentPage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);


    if (!personalEmail || !name || !phoneNumber || !dob) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc: Personal Email, Name, Phone Number, Date of Birth.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/users/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          personalEmail,
          name,
          phoneNumber,
          dob,

        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log('Tạo hồ sơ thành công:', data);

        onProfileCreated();
      } else {
        console.error('Tạo hồ sơ thất bại:', data);
        setError(data.message || 'Tạo hồ sơ thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc lỗi không mong muốn:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  return (

    <Container component="main" maxWidth="sm">
      <FormContainer>
        <Typography component="h1" variant="h5" color="#4a90e2" sx={{ mb: 3, fontWeight: 600, fontSize: '1.5rem' }}> 
          Tạo Hồ Sơ Của Bạn
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="personalEmail"
            label="Email Cá Nhân"
            name="personalEmail"
            autoComplete="email"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}

            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#4a90e2' },
                '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Họ và Tên"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#4a90e2' },
                '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Số Điện Thoại"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#4a90e2' },
                '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dob"
            label="Ngày Sinh"
            name="dob"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#4a90e2' },
                '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
              },
            }}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo Hồ Sơ'}
          </Button>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default CreateProfile;
