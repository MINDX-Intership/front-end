import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import Homepage from './components/Homepage';
import Files from './components/Files';
import Notifications from './components/Notification';
import Chat from './components/Chat';
import PersonalWork from './components/PersonalWork';
import VerifyEmailPage from './components/VerifyEmailPage';
import CreateProfile from './components/CreateProfile';
import PersonalTask from './components/PersonalTask';
import About from './components/About';
import Timeline from './components/Timeline';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
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
    if (!token) {
      console.log("No token provided to fetchUserProfile.");
      return { needsProfileCreation: false, error: false, user: null };
    }
    if (fetchingRef.current) {
      return { needsProfileCreation: false, error: false, user: null };
    }

    fetchingRef.current = true;
    setIsFetchingProfile(true);

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
        if (data.message && data.message.includes('Không tìm thấy thông tin người dùng')) {
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
      setIsFetchingProfile(false);
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
        } else if (profileResult.user) {
          // REMOVED: The condition that caused immediate redirect to homepage
          // const publicOrRootPages = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/about', '/timeline'];
          // if (publicOrRootPages.some(publicPath => currentPage.startsWith(publicPath))) {
          //   navigate('/homepage');
          // }
          // If the user is authenticated and on a public page, they will now remain there
          // unless another specific condition forces a redirect (e.g., no profile).
          // If you want to ensure authenticated users always go to homepage when opening the app,
          // regardless of the initial URL, you might add:
          // if (currentPage === '/' || currentPage === '/login' || currentPage === '/register') {
          //   navigate('/homepage');
          // }
          // However, for allowing them to stay on about/timeline if they explicitly navigate there,
          // the current removal is sufficient.
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
      navigate('/homepage'); // Keep this redirect after successful login
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

    if (isInitializing) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
          <CircularProgress />
          <p style={{ marginTop: '16px' }}>Đang tải dữ liệu phiên đăng nhập...</p>
        </div>
      );
    }

    const publicPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/about', '/timeline'];
    const isPublicPage = publicPages.some(publicPath => path.startsWith(publicPath));

    // If no auth token and not a public page, redirect to login
    if (!isPublicPage && !authToken) {
      navigate('/login');
      return null;
    }

    // If authenticated and on login/register, redirect to homepage
    if ((path === '/login' || path === '/register') && authToken && currentUser) {
      navigate('/homepage');
      return null;
    }

    // If authenticated but no user profile, redirect to create-profile (unless already there)
    if (authToken && !currentUser && !isPublicPage && path !== '/create-profile') {
        navigate('/create-profile');
        return null;
    }

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
        return <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={fetchUserProfile} />;
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
      case path === '/personal-work':
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        return <PersonalTask setCurrentPage={navigate} />;
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
        // If not authenticated or no user, redirect to login (handled by the general check above)
        if (!authToken || !currentUser) {
            navigate('/login');
            return null;
        }
        return <Homepage setCurrentPage={navigate} />;
      default:
        // If an unknown path and authenticated, redirect to homepage
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