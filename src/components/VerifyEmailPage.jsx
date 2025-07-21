// VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast

const VerifyEmailPage = ({ token, setCurrentPage, onVerificationSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(true); // Control CircularProgress
  // const [status, setStatus] = useState('Verifying...'); // Removed, controlled by isVerifying
  // const [message, setMessage] = useState(''); // Removed, messages handled by toast

  useEffect(() => {
    if (!token) {
      // setStatus('Error'); // Replaced by toast
      toast.error('Không tìm thấy token xác thực.');
      setTimeout(() => setCurrentPage('/login'), 3000);
      return;
    }

    const verifyAccountAndCreateProfile = async () => {
      setIsVerifying(true); // Start verifying
      try {
        console.log('VerifyEmailPage: Using token in verification URL.');
        const verificationResponse = await fetch(`http://localhost:3000/api/account/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const verificationData = await verificationResponse.json();

        if (verificationResponse.ok) {
          // setStatus('Success'); // Replaced by toast
          toast.success(verificationData.message || 'Xác thực tài khoản thành công!');

          const authToken = verificationData.token;
          if (authToken) {
            console.log('VerifyEmailPage: Auth token received after verification.');
            onVerificationSuccess(authToken, verificationData.account);
          } else {
            toast.info('Xác thực thành công. Vui lòng đăng nhập.'); // Use toast.info
            setTimeout(() => setCurrentPage('/login'), 3000);
          }
        } else {
          // setStatus('Error'); // Replaced by toast
          toast.error(verificationData.message || 'Xác thực tài khoản thất bại.');
          setTimeout(() => setCurrentPage('/login'), 3000);
        }
      } catch (error) {
        console.error('Lỗi xác thực email:', error);
        // setStatus('Error'); // Replaced by toast
        toast.error('Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại.');
        setTimeout(() => setCurrentPage('/login'), 3000);
      } finally {
        setIsVerifying(false); // Stop verifying
      }
    };
    verifyAccountAndCreateProfile();
  }, [token, setCurrentPage, onVerificationSuccess]);

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography component="h1" variant="h5" color="primary" sx={{ mb: 2 }}>
          Xác thực Email
        </Typography>
        {isVerifying ? ( // Use isVerifying state for CircularProgress
          <CircularProgress sx={{ mb: 2 }} />
        ) : (
          // Remove direct Typography message display here, as toasts handle it
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Quá trình xác thực đã hoàn tất.
          </Typography>
        )}
        {!isVerifying && (
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
            nếu cần.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;