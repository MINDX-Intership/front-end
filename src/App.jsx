import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Login from './components/User/Login';
import Register from './components/User/Register';
import Profile from './components/User/Profile';
import ResetPassword from './components/User/ResetPassword';
import ForgotPassword from './components/User/ForgotPassword';
import Homepage from './components/Homepage';
import Notifications from './components/Notification';
import Chat from './components/Chat';
import PersonalWork from './components/PersonalWork';
import VerifyEmailPage from './components/User/VerifyEmailPage';
import CreateProfile from './components/User/CreateProfile';
import PersonalTask from './components/Task/PersonalTask';
import About from './components/About';
import Timeline from './components/Task/Timeline';
import SprintsPage from './components/Sprint/SprintsPage';
import CreateSprint from './components/Sprint/CreateSprint';
import Admin from './components/Admin/Admin';
import AdminReport from './components/Admin/AdminReport';
import AdminTimeline from './components/Admin/AdminTimeline';
import MeetingSchedule from './components/MeetingSchedule';
import SupportRequest from './components/SupportRequest';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchingRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  }, []);

  const fetchUserProfile = useCallback(async (token) => {
    if (!token || fetchingRef.current) {
      console.log(token ? "fetchUserProfile already in progress, skipping." : "No token provided to fetchUserProfile.");
      return { needsProfileCreation: false, error: false, user: null };
    }

    fetchingRef.current = true;
    try {
      const response = await fetch('http://localhost:3000/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.message?.includes('Không tìm thấy thông tin người dùng')) {
          setCurrentUser(null);
          return { needsProfileCreation: true, error: false, user: null };
        } else {
          setCurrentUser(data.user);
          return { needsProfileCreation: false, error: false, user: data.user };
        }
      } else {
        setCurrentUser(null);
        console.error("Error fetching profile, response not ok:", data.message);
        return { needsProfileCreation: false, error: true, user: null, message: data.message };
      }
    } catch (error) {
      console.error("Fetch profile network/unexpected error:", error);
      setCurrentUser(null);
      return { needsProfileCreation: false, error: true, user: null, message: error.message };
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setIsInitializing(true);
    toast.info("Bạn đã đăng xuất.");
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      if (authToken) {
        const profileResult = await fetchUserProfile(authToken);
        if (profileResult.needsProfileCreation) {
          toast.warn("Không tìm thấy hồ sơ người dùng. Vui lòng tạo hồ sơ.");
          navigate('/create-profile');
        } else if (profileResult.error) {
          toast.error(profileResult.message || "Phiên đăng nhập không hợp lệ hoặc có lỗi. Vui lòng đăng nhập lại.");
          handleLogout();
        }
      } else {
        const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/about', '/timeline'];
        if (!publicPages.some(publicPath => currentPage.startsWith(publicPath))) {
          navigate('/login');
        }
      }
      setIsInitializing(false);
    };

    initializeApp();
  }, [authToken, navigate, fetchUserProfile, currentPage, handleLogout]);

  const handleLoginSuccess = useCallback(async (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    toast.success("Đăng nhập thành công!");
    const profileResult = await fetchUserProfile(token);
    if (profileResult.needsProfileCreation) {
      toast.warn("Bạn chưa có hồ sơ. Vui lòng tạo hồ sơ.");
      navigate('/create-profile');
    } else if (profileResult.error) {
      toast.error(profileResult.message || "Đăng nhập thành công nhưng không thể tải hồ sơ. Vui lòng thử lại.");
    } else {
      navigate('/homepage');
    }
  }, [fetchUserProfile, navigate]);

  const handleProfileCreatedOrUpdated = useCallback(async () => {
    toast.success("Hồ sơ đã được tạo/cập nhật thành công!");
    if (authToken) {
      const profileResult = await fetchUserProfile(authToken);
      if (profileResult.user) {
        navigate('/profile');
      } else {
        toast.error("Có lỗi khi tải lại hồ sơ sau khi tạo/cập nhật. Vui lòng thử lại đăng nhập.");
        handleLogout();
      }
    }
  }, [authToken, fetchUserProfile, navigate, handleLogout]);

  const renderCurrentPage = () => {
    const path = currentPage;
    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/about', '/timeline'];
    const isPublicPage = publicPages.some(publicPath => path.startsWith(publicPath));

    if (isInitializing) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
          <CircularProgress />
          <p style={{ marginTop: '16px' }}>Đang tải dữ liệu phiên đăng nhập...</p>
        </div>
      );
    }

    if (!isPublicPage && !authToken) {
      navigate('/login');
      return null;
    }

    if ((path === '/login' || path === '/register') && authToken && currentUser) {
      navigate('/homepage');
      return null;
    }

    if (authToken && !currentUser && !isPublicPage && path !== '/create-profile') {
        navigate('/create-profile');
        return null;
    }

    const commonAuthProtectedPageCheck = () => {
      if (!authToken) {
        navigate('/login');
        return true;
      }
      if (!currentUser) {
          return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                  <CircularProgress />
                  <p style={{ marginTop: '16px' }}>Đang tải thông tin người dùng...</p>
              </div>
          );
      }
      return false;
    };

    switch (true) {
      case path === '/login':
        return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
      case path === '/register':
        return <Register setCurrentPage={navigate} />;
      case path === '/forgot-password':
        return <ForgotPassword setCurrentPage={navigate} />;
      case path.startsWith('/reset-password/'):
        const resetToken = path.split('/reset-password/')[1];
        return <ResetPassword setCurrentPage={navigate} token={resetToken} />;
      case path.startsWith('/verify-email/'):
        const emailVerificationToken = path.split('/verify-email/')[1];
        if (!emailVerificationToken) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Mã xác minh email không hợp lệ hoặc bị thiếu.</p>
                </div>
            );
        }
        return (
          <VerifyEmailPage
            token={emailVerificationToken}
            setCurrentPage={navigate}
            onVerificationSuccess={handleLoginSuccess}
          />
        );
      case path === '/profile':
        const profileCheck = commonAuthProtectedPageCheck();
        if (profileCheck === true) return null;
        if (profileCheck !== false) return profileCheck; // Return loading component if currentUser is null
        return <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={handleProfileCreatedOrUpdated} />;
      case path === '/create-profile':
        if (!authToken) {
            navigate('/login');
            return null;
        }
        return (
          <CreateProfile
            setCurrentPage={navigate}
            authToken={authToken}
            onProfileCreated={handleProfileCreatedOrUpdated}
          />
        );
      case path === '/sprints':
        const sprintsCheck = commonAuthProtectedPageCheck();
        if (sprintsCheck === true) return null;
        if (sprintsCheck !== false) return sprintsCheck;
        return <SprintsPage authToken={authToken} currentUser={currentUser} setCurrentPage={navigate} />;
      case path === '/create-sprint':
        const createSprintCheck = commonAuthProtectedPageCheck();
        if (createSprintCheck === true) return null;
        if (createSprintCheck !== false) return createSprintCheck;
        return <CreateSprint authToken={authToken} currentUser={currentUser} setCurrentPage={navigate} />;
      case path === '/personal-work':
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        return <PersonalTask setCurrentPage={navigate} authToken={authToken} />;
      case path === '/notifications':
        return <Notifications setCurrentPage={navigate} />;
      case path === '/chat':
        return <Chat setCurrentPage={navigate} />;
      case path === '/about':
        return <About />;
      case path === '/timeline':
        return <Timeline />;
      case path === '/homepage':
      case path === '/':
        if (!authToken || !currentUser) {
            navigate('/login');
            return null;
        }
        return <Homepage setCurrentPage={navigate} />;
      default:
        if (authToken && currentUser) {
          navigate('/homepage');
          return null;
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <p>Trang không tìm thấy.</p>
            </div>
        );
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
}

export default App;