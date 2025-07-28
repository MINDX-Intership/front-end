import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

const CreateProfile = ({ setCurrentPage, authToken, onProfileCreated }) => {
  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [availableJobPositions, setAvailableJobPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingJobPositions, setFetchingJobPositions] = useState(false);

  const fetchingJobPositionsRef = useRef(false);

  useEffect(() => {
    const fetchJobPositions = async () => {
      if (fetchingJobPositionsRef.current) return;
      fetchingJobPositionsRef.current = true;
      setFetchingJobPositions(true);

      try {
        const response = await fetch('http://localhost:3000/api/job-position/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAvailableJobPositions(data.jobPositions);
        } else {
          toast.error(data.message || "Lỗi khi tải danh sách chức vụ.");
        }
      } catch (error) {
        console.error("Fetch job positions error:", error);
        toast.error("Lỗi mạng hoặc lỗi không mong muốn khi tải chức vụ.");
      } finally {
        fetchingJobPositionsRef.current = false;
        setFetchingJobPositions(false);
      }
    };

    if (authToken) {
      fetchJobPositions();
    } else {
      toast.error("Không có token xác thực. Vui lòng đăng nhập lại.");
      setCurrentPage('/login');
    }
  }, [authToken, setCurrentPage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Build payload and log for debugging
    const payload = {
      personalEmail,
      companyEmail: "",
      name,
      phoneNumber,
      dob,
      departs: [],
      jobPosition: [jobPosition],
    };
    console.log('Creating profile with payload:', payload);

    try {
      const response = await fetch('http://localhost:3000/api/user/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Hồ sơ đã được tạo thành công!');
        onProfileCreated();
      } else {
        toast.error(data.message || 'Tạo hồ sơ thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo hồ sơ:', error);
      toast.error('Lỗi mạng hoặc lỗi không mong muốn khi tạo hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJobPositions) {
    return (
      <Container component="main" maxWidth="xs">
        <FormContainer>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Đang tải danh sách chức vụ...
          </Typography>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <FormContainer>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Tạo Hồ Sơ Người Dùng
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="dob"
            label="Ngày Sinh"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: "1900-01-01",
              max: new Date().toISOString().split("T")[0],
            }}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="job-position-label">Chức vụ</InputLabel>
            <Select
              labelId="job-position-label"
              id="jobPosition"
              value={jobPosition}
              label="Chức vụ"
              onChange={(e) => setJobPosition(e.target.value)}
            >
              <MenuItem value=""><em>Chọn chức vụ</em></MenuItem>
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
            sx={{ mt: 3, mb: 10, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}
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
