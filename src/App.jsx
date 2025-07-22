import React, { useState, useEffect, useCallback } from 'react';
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

function App() {
  // State management for current page, authentication token, user data, and loading status
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);

  // Effect for handling browser history navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Callback for navigating between pages
  const navigate = useCallback((path) => {
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  }, [currentPage]);

  // Callback for fetching user profile
  const fetchUserProfile = useCallback(async (token) => {
    if (!token || isFetchingProfile) {
      return null;
    }
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
        localStorage.removeItem('token');
        setAuthToken(null);
        setCurrentUser(null);
        toast.error(data.message || "Lỗi khi tải hồ sơ người dùng. Vui lòng đăng nhập lại.");
        return { needsProfileCreation: false, error: true, user: null };
      }
    } catch (error) {
      localStorage.removeItem('token');
      setAuthToken(null);
      setCurrentUser(null);
      toast.error("Lỗi mạng hoặc lỗi không mong muốn khi tải hồ sơ. Vui lòng thử lại.");
      return { needsProfileCreation: false, error: true, user: null };
    } finally {
      setIsFetchingProfile(false);
    }
  }, [isFetchingProfile]);

  // Effect for initial session check and profile loading
  // MODIFIED: Removed automatic navigation to /login on profile error or no token
  useEffect(() => {
    const initializeUserSession = async () => {
      if (authToken && !isFetchingProfile) {
        const profileResult = await fetchUserProfile(authToken);
        // Original: if (profileResult && profileResult.needsProfileCreation) { navigate('/create-profile'); }
        // Keeping navigate to create-profile if profile is needed
        if (profileResult && profileResult.needsProfileCreation) {
          navigate('/create-profile');
        }
        // Original: else if (profileResult && profileResult.error) { navigate('/login'); }
        // Removed automatic navigation to /login on profile error
      }
      // Original: else if (!authToken && !isFetchingProfile && !['/login', '/register', '/forgot-password', '/reset-password', '/about', '/timeline'].includes(currentPage)) { }
      // Removed automatic navigation for unauthenticated users
      setInitialLoadAttempted(true);
    };

    if (!initialLoadAttempted) {
      initializeUserSession();
    } else if (authToken && !currentUser && !isFetchingProfile) {
      initializeUserSession();
    }
  }, [authToken, fetchUserProfile, navigate, currentPage, isFetchingProfile, initialLoadAttempted, currentUser]);

  // Effect for post-login/profile update navigation
  // MODIFIED: Removed automatic navigation to /homepage
  useEffect(() => {
    // Original: if (authToken && currentUser && initialLoadAttempted) {
    // Original:   const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/'];
    // Original:   const isOnPublicPage = publicPaths.includes(currentPage);
    // Original:   if (isOnPublicPage || currentPage === '/') {
    // Original:     navigate('/homepage');
    // Original:   }
    // Original: }
    // Removed all automatic navigation to homepage
  }, [authToken, currentUser, currentPage, navigate, initialLoadAttempted]);

  // Callback for successful login
  const handleLoginSuccess = useCallback(async (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    toast.success("Đăng nhập thành công!");
    // The user will now remain on the page where login was initiated,
    // or navigate manually if needed.
    // To ensure user is directed to homepage after login, you might
    // consider adding navigate('/homepage') here if desired.
    // However, the request was to remove all automatic navigations.
    // So for now, keeping it minimal.
  }, []);

  // Callback for user logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setInitialLoadAttempted(false);
    toast.info("Bạn đã đăng xuất.");
    navigate('/login'); // Keeping this navigation for logout as it's a user-initiated action
  }, [navigate]);

  // Callback for profile creation/update
  const handleProfileCreatedOrUpdated = useCallback(async () => {
    toast.success("Hồ sơ đã được tạo/cập nhật thành công!");
    if (authToken) {
      await fetchUserProfile(authToken);
    }
  }, [authToken, fetchUserProfile]);

  // Function to render the current page component based on the path
  const renderCurrentPage = () => {
    const path = currentPage;

    // Display loading spinner while initial session check is in progress
    if (!initialLoadAttempted && authToken) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <p>Đang tải hồ sơ...</p>
        </div>
      );
    }

    switch (true) {
      case path === '/login':
        return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
      case path === '/register':
        return <Register setCurrentPage={navigate} />;
      case path === '/forgot-password':
        return <ForgotPassword setCurrentPage={navigate} />;
      case path.startsWith('/reset-password/'):
        // Để lấy token từ URL như /reset-password/YOUR_TOKEN_HERE
        const resetToken = path.split('/reset-password/')[1];
        return <ResetPassword setCurrentPage={navigate} token={resetToken} />;
      case path.startsWith('/verify-email/'): // Thay đổi từ path === '/verify-email' và thêm logic lấy token
        // Trích xuất token từ đường dẫn
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
            token={emailVerificationToken} // Truyền token đã trích xuất
            setCurrentPage={navigate}
            onVerificationSuccess={handleLoginSuccess}
          />
        );
      case path === '/profile':
        if (!authToken) {
            // Original: navigate('/login'); return null;
            // Changed: Show a message instead of navigating
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để xem hồ sơ.</p>
                </div>
            );
        }
        return <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={handleProfileCreatedOrUpdated} />;
      case path === '/create-profile':
        if (!authToken) {
            // Original: navigate('/login'); return null;
            // Changed: Show a message instead of navigating
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để tạo hồ sơ.</p>
                </div>
            );
        }
        return (
          <CreateProfile
            setCurrentPage={navigate}
            authToken={authToken}
            onProfileCreated={handleProfileCreatedOrUpdated}
          />
        );
      case path === '/personal-work':
        if (!authToken) {

            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để xem công việc cá nhân.</p>
                </div>
            );
        }
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        if (!authToken) {
            // Original: return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
            // Changed: Show a message instead of rendering Login component
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để xem công việc cá nhân.</p>
                </div>
            );
        }
        return <PersonalTask setCurrentPage={navigate} />;
      case path === '/notifications':
        if (!authToken) {
            // Original: return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
            // Changed: Show a message instead of rendering Login component
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để xem thông báo.</p>
                </div>
            );
        }
        return <Notifications setCurrentPage={navigate} />;
      case path === '/chat':
        if (!authToken) {
            // Original: return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
            // Changed: Show a message instead of rendering Login component
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <p>Bạn cần đăng nhập để vào phòng chat.</p>
                </div>
            );
        }
        return <Chat setCurrentPage={navigate} />;
      case path === '/about':
        return <About />;
      case path === '/timeline':
        return <Timeline />;
      default:
        // Nếu không khớp với bất kỳ case nào ở trên, và người dùng đã đăng nhập, hiển thị Homepage
        if (authToken && currentUser) {
          return <Homepage setCurrentPage={navigate} />;
        }
        // Nếu không có authToken và đã cố gắng tải lần đầu (initialLoadAttempted)
        // Đây có thể là trường hợp người dùng cố gắng truy cập một đường dẫn không tồn tại
        // hoặc đường dẫn không yêu cầu đăng nhập nhưng không có trang cụ thể
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <p>Trang không tìm thấy hoặc bạn cần đăng nhập.</p>
            {/* Bạn có thể thêm nút hoặc liên kết để đăng nhập ở đây nếu muốn */}
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