// CreateProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  FormControl, // New import
  InputLabel, // New import
  Select, // New import
  MenuItem, // New import
} from '@mui/material';
import { styled } from '@mui/system';
import { toast } from 'react-toastify'; // Import toast

const FormContainer = styled(Box)(({ }) => ({
  marginTop: '64px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '8px',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
}));

const CreateProfile = ({ setCurrentPage, authToken, onProfileCreated }) => {
  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [jobPosition, setJobPosition] = useState(''); // State for selected job position ID
  const [availableJobPositions, setAvailableJobPositions] = useState([]); // State to store fetched job positions
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authToken) {
      setCurrentPage('/login');
    }
  }, [authToken, setCurrentPage]);

  // Effect to fetch job positions
  useEffect(() => {
    const fetchJobPositions = async () => {
      try {
        // Assuming there's an API endpoint to get job positions
        const response = await fetch('http://localhost:3000/api/jobpositions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Include auth token if needed for this endpoint
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAvailableJobPositions(data.jobPositions); // Assuming data.jobPositions is an array of { _id, title }
        } else {
          console.error('Failed to fetch job positions:', data.message);
          toast.error('Không thể tải danh sách chức vụ. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error fetching job positions:', error);
        toast.error('Lỗi kết nối khi tải danh sách chức vụ.');
      }
    };

    if (authToken) { // Only fetch if authToken is available
      fetchJobPositions();
    }
  }, [authToken]); // Dependency on authToken

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validate required fields including jobPosition
    if (!personalEmail || !name || !phoneNumber || !dob || !jobPosition) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc: Email Cá Nhân, Tên, Số điện thoại, Ngày Sinh, và Chức vụ.');
      setLoading(false);
      return;
    }

    try {
      console.log('CreateProfile: Using authToken in fetch header.');
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
          jobPosition: [jobPosition], // Send jobPosition as an array containing the selected ID
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log('Tạo hồ sơ thành công:', data);
        toast.success('Tạo hồ sơ thành công!');
        onProfileCreated();
      } else {
        console.error('Tạo hồ sơ thất bại:', data);
        toast.error(data.message || 'Tạo hồ sơ thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc lỗi không mong muốn:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
            label="Tên"
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
          {/* Replaced TextField with Select for jobPosition */}
          <FormControl fullWidth margin="normal" required sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#4a90e2' },
                '&.Mui-focused fieldset': { borderColor: '#4a90e2' },
              },
            }}>
            <InputLabel id="job-position-label">Chức vụ</InputLabel>
            <Select
              labelId="job-position-label"
              id="jobPosition"
              value={jobPosition}
              label="Chức vụ"
              onChange={(e) => setJobPosition(e.target.value)}
            >
              <MenuItem value="">
                <em>Chọn chức vụ</em>
              </MenuItem>
              {availableJobPositions.map((position) => (
                <MenuItem key={position._id} value={position._id}>
                  {position.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
