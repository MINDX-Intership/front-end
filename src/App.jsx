import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import Homepage from './components/Homepage';
import Files from './components/Files';
import Notifications from './components/Notification';
import Chat from './components/Chat';
import PersonalWork from './components/PersonalWork';
import VerifyEmailPage from './components/VerifyEmailPage';
import CreateProfile from './components/CreateProfile';
import { Typography } from '@mui/material';
import PersonalTask from './components/PersonalTask';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);

  // Xử lý sự kiện popstate của trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Phần fetch thông tin người dùng
  const fetchUserProfile = useCallback(async (token) => {
    if (!token || isFetchingProfile) {
      return;
    }

    setIsFetchingProfile(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message && data.message.includes('Không tìm thấy thông tin người dùng')) {
          setCurrentUser(null);
          return { needsProfileCreation: true };
        } else {
          setCurrentUser(data);
          return { needsProfileCreation: false };
        }
      } else {
        localStorage.removeItem('token');
        setAuthToken(null);
        setCurrentUser(null);
        return { error: true };
      }
    } catch (error) {
      localStorage.removeItem('token');
      setAuthToken(null);
      setCurrentUser(null);
      return { error: true };
    } finally {
      setIsFetchingProfile(false);
    }
  }, [isFetchingProfile]);

  //redirect login
  // useEffect(() => {
  //   const initializeUserSession = async () => {
  //     if (authToken) {
  //       const profileResult = await fetchUserProfile(authToken);
  //       if (profileResult && profileResult.needsProfileCreation) {
  //         navigate('/create-profile');
  //       } else if (profileResult && !profileResult.error) {
  //         if (currentPage === '/login' || currentPage === '/register' || currentPage.startsWith('/verify-email') || currentPage.startsWith('/reset-password')) {
  //           navigate('/homepage');
  //         }
  //       } else if (profileResult && profileResult.error) {
  //         navigate('/login');
  //       }
  //     } else {
  //       const publicPages = ['/login', '/register'];
  //       if (!publicPages.some(path => currentPage.startsWith(path)) && !currentPage.startsWith('/verify-email') && !currentPage.startsWith('/reset-password')) {
  //         navigate('/login');
  //       }
  //     }
  //   };

  //   initializeUserSession();
  // }, [authToken, currentPage, fetchUserProfile]);

  // Điều hướng trang
  const navigate = useCallback((path) => {
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  }, []);

  // Xử lý đăng nhập thành công
  const handleLoginSuccess = useCallback(async (token, accountData) => {
    localStorage.setItem('token', token);
    setAuthToken(token);

    const profileResult = await fetchUserProfile(token);
    if (profileResult && profileResult.needsProfileCreation) {
      navigate('/create-profile');
    } else if (profileResult && !profileResult.error) {
      navigate('/homepage');
    } else {
      navigate('/login');
    }
  }, [navigate, fetchUserProfile]);

  // Xử lý đăng xuất
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    navigate('/login');
  }, [navigate]);

  // Phần render các components chính
  const renderCurrentPage = () => {
    const path = currentPage;
    let token = null;

    if (path.startsWith('/verify-email/')) {
      token = path.substring('/verify-email/'.length);
    } else if (path.startsWith('/reset-password/')) {
      token = path.substring('/reset-password/'.length);
    }

    switch (true) {
      case path === '/login':
        return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
      case path === '/register':
        return <Register setCurrentPage={navigate} />;
      case path.startsWith('/verify-email/'):
        return <VerifyEmailPage token={token} setCurrentPage={navigate} onVerificationSuccess={handleLoginSuccess} />;
      case path === '/homepage':
        return <Homepage setCurrentPage={navigate} />;
      case path === '/files':
        return <Files setCurrentPage={navigate} />;
      case path === '/profile':
        return currentUser ? (
          <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={() => fetchUserProfile(authToken)} />
        ) : (
          <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>Đang tải hồ sơ hoặc hồ sơ chưa được tạo...</Typography>
        );
      case path === '/create-profile':
        return <CreateProfile setCurrentPage={navigate} authToken={authToken} onProfileCreated={() => fetchUserProfile(authToken).then(() => navigate('/homepage'))} />;
      case path.startsWith('/reset-password/'):
        return <ResetPassword setCurrentPage={navigate} token={token} />;
      case path === '/personal-work':
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        return <PersonalTask setCurrentPage={navigate} />;
      case path === '/notifications':
        return <Notifications setCurrentPage={navigate} />;
      case path === '/chat':
        return <Chat setCurrentPage={navigate} />;
      default:
        return authToken ? <Homepage setCurrentPage={navigate} /> : <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
    </div>
  );
}

export default App;