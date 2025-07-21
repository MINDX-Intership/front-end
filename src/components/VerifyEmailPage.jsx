import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const VerifyEmailPage = ({ token, setCurrentPage, onVerificationSuccess }) => {
  const [status, setStatus] = useState('Verifying...');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('Error');
      setMessage('Không tìm thấy token xác thực.');
      setTimeout(() => setCurrentPage('/login'), 3000);
      return;
    }

    // Phần xác thực tài khoản và gọi callback
    const verifyAccountAndCreateProfile = async () => {
      try {
        const verificationResponse = await fetch(`http://localhost:3000/api/accounts/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const verificationData = await verificationResponse.json();

        if (verificationResponse.ok) {
          setStatus('Success');
          setMessage(verificationData.message || 'Xác thực tài khoản thành công!');

          const authToken = verificationData.token;
          if (authToken) {
            onVerificationSuccess(authToken, verificationData.account);
          } else {
            setMessage('Xác thực thành công nhưng không nhận được token đăng nhập. Vui lòng đăng nhập.');
            setTimeout(() => setCurrentPage('/login'), 3000);
          }
        } else {
          setStatus('Error');
          setMessage(verificationData.message || 'Xác thực tài khoản thất bại. Token không hợp lệ hoặc đã hết hạn.');
          setTimeout(() => setCurrentPage('/login'), 3000);
        }
      } catch (error) {
        setStatus('Error');
        setMessage('Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau.');
        setTimeout(() => setCurrentPage('/login'), 3000);
      }
    };

    // Hiển thị trạng thái "Verifying..." trong 3 giây
    const timer = setTimeout(() => {
      verifyAccountAndCreateProfile();
    }, 3000);

    return () => clearTimeout(timer);

  }, [token, setCurrentPage, onVerificationSuccess]);

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography component="h1" variant="h5" color="primary" sx={{ mb: 2 }}>
          Xác thực Email
        </Typography>
        {status === 'Verifying...' ? (
          <CircularProgress sx={{ mb: 2 }} />
        ) : (
          <Typography variant="body1" color={status === 'Success' ? 'success.main' : 'error'} sx={{ textAlign: 'center' }}>
            {message}
          </Typography>
        )}
        {status !== 'Verifying...' && status !== 'Success' && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Bạn có thể{' '}
            <span
              style={{ cursor: 'pointer', color: '#4a90e2', textDecoration: 'underline' }}
              onClick={() => setCurrentPage('/login')}
            >
              đăng nhập
            </span>{' '}
            hoặc{' '}
            <span
              style={{ cursor: 'pointer', color: '#4a90e2', textDecoration: 'underline' }}
              onClick={() => setCurrentPage('/register')}
            >
              đăng ký
            </span>{' '}
            tài khoản mới.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;