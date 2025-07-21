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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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
    console.log(`Navigating from ${currentPage} to ${path}`);
    window.history.pushState(null, '', path);
    setCurrentPage(path);
  }, [currentPage]);

  const fetchUserProfile = useCallback(async (token) => {
    if (!token || isFetchingProfile) {
      console.log("fetchUserProfile: No token or already fetching, returning null.");
      return null;
    }

    setIsFetchingProfile(true);
    try {
      console.log("fetchUserProfile: Attempting to fetch /api/account/me with token.");
      const response = await fetch('http://localhost:3000/api/account/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message && data.message.includes('Không tìm thấy thông tin người dùng')) {
          console.log("fetchUserProfile: Profile not found for this user. Setting currentUser to null.");
          setCurrentUser(null);
          return { needsProfileCreation: true, error: false };
        } else {
          console.log("fetchUserProfile: User profile found. Current user data:", data);
          setCurrentUser(data);
          return { needsProfileCreation: false, error: false };
        }
      } else {
        console.error("fetchUserProfile: Response not OK. Status:", response.status, "Data:", data);
        localStorage.removeItem('token');
        setAuthToken(null);
        setCurrentUser(null);
        toast.error(data.message || "Lỗi khi tải hồ sơ người dùng. Vui lòng đăng nhập lại.");
        return { needsProfileCreation: false, error: true };
      }
    } catch (error) {
      console.error("Error fetching user profile (network/unexpected):", error);
      localStorage.removeItem('token');
      setAuthToken(null);
      setCurrentUser(null);
      toast.error("Lỗi mạng hoặc lỗi không mong muốn khi tải hồ sơ. Vui lòng thử lại.");
      return { needsProfileCreation: false, error: true };
    } finally {
      setIsFetchingProfile(false);
    }
  }, [isFetchingProfile]);

  useEffect(() => {
    const initializeUserSession = async () => {
      console.log("App.jsx useEffect: Initializing user session. Checking for AuthToken.");
      // Define a set of public paths that don't require an authToken
      const publicPaths = ['/login', '/register', '/forgot-password', '/verify-email', '/reset-password'];

      // Check if the current page starts with any of the public paths
      const isPublicPage = publicPaths.some(path => currentPage.startsWith(path));

      if (authToken) {
        // User is authenticated
        const profileResult = await fetchUserProfile(authToken);
        if (profileResult && profileResult.needsProfileCreation) {
          console.log("App.jsx useEffect: Profile needs creation, navigating to /create-profile.");
          navigate('/create-profile');
        } else if (profileResult && !profileResult.error) {
          console.log("App.jsx useEffect: Profile fetched successfully.");
          // If authenticated and on a public page (like login/register after login), redirect to homepage
          if (isPublicPage || currentPage === '/') {
            console.log("App.jsx useEffect: On auth/root page after profile fetch, navigating to /homepage.");

          }
        } else if (profileResult && profileResult.error) {
          console.error("App.jsx useEffect: Error fetching profile, logging out and redirecting to login.");
          localStorage.removeItem('token');
          setAuthToken(null);
          setCurrentUser(null);
          navigate('/login');
        }
      } else {
        // User is not authenticated
        console.log("App.jsx useEffect: No authToken.");
        if (!isPublicPage) { // If not authenticated and not on a public page, redirect to login
          console.log("App.jsx useEffect: On a protected page without token, navigating to /login.");
          navigate('/login');
        } else {
          console.log("App.jsx useEffect: On a public page, no redirection needed.");
        }
      }
      setInitialLoadComplete(true);
    };
    if (!initialLoadComplete) {
      initializeUserSession();
    }
  }, [authToken, currentPage, navigate, fetchUserProfile, initialLoadComplete]);


  const handleLoginSuccess = useCallback(async (token, accountData) => {
    console.log("handleLoginSuccess: Token received, setting localStorage...");
    localStorage.setItem('token', token);
    setAuthToken(token);
    const profileResult = await fetchUserProfile(token);
    if (profileResult && !profileResult.error && !profileResult.needsProfileCreation) {
      navigate('/homepage');
    } else if (profileResult && profileResult.needsProfileCreation) {
      toast.info("Vui lòng tạo hồ sơ của bạn.");
      navigate('/create-profile');
    } else {
      console.error("handleLoginSuccess: Failed to re-fetch profile after login or profile still missing. Redirecting to login.");
      toast.error("Đăng nhập thành công nhưng không thể tải hồ sơ. Vui lòng thử lại.");
      navigate('/login');
    }
  }, [navigate, fetchUserProfile]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    toast.info("Bạn đã đăng xuất.");
    navigate('/login');
  }, [navigate]);

  const handleProfileCreated = useCallback(async () => {
    console.log("onProfileCreated: Profile created successfully, re-fetching profile...");
    toast.success("Hồ sơ đã được tạo thành công!");
    if (authToken) {
      const profileResult = await fetchUserProfile(authToken);
      if (profileResult && !profileResult.error && !profileResult.needsProfileCreation) {
        navigate('/homepage');
      } else {
        console.error("onProfileCreated: Failed to re-fetch profile after creation or profile still missing. Redirecting to login.");
        toast.error("Không thể tải hồ sơ sau khi tạo. Vui lòng đăng nhập lại.");
        navigate('/login');
      }
    }
  }, [authToken, fetchUserProfile, navigate]);

  const renderCurrentPage = () => {
    const path = currentPage;
    // The token for verify-email comes from query params, so keep this line
    const token = new URLSearchParams(window.location.search).get('token');

    switch (true) {
      case path === '/login':
        return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
      case path === '/register':
        return <Register setCurrentPage={navigate} />;
      case path === '/forgot-password':
        return <ForgotPassword setCurrentPage={navigate} />;
      case path.startsWith('/reset-password/'):
        return <ResetPassword setCurrentPage={navigate} />;
      case path === '/verify-email':
        return (
          <VerifyEmailPage
            token={token}
            setCurrentPage={navigate}
            onVerificationSuccess={handleLoginSuccess}
          />
        );
      case path === '/profile':
        if (!authToken) return navigate('/login');
        return <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={fetchUserProfile} />;
      case path === '/create-profile':
        if (!authToken) return navigate('/login');
        return (
          <CreateProfile
            setCurrentPage={navigate}
            authToken={authToken}
            onProfileCreated={handleProfileCreated}
          />
        );
      case path === '/personal-work':
        if (!authToken) return navigate('/login');
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        if (!authToken) return navigate('/login');
        return <PersonalTask setCurrentPage={navigate} />;
      case path === '/notifications':
        if (!authToken) return navigate('/login');
        return <Notifications setCurrentPage={navigate} />;
      case path === '/chat':
        if (!authToken) return navigate('/login');
        return <Chat setCurrentPage={navigate} />;
      default:
        // If there's an auth token, show homepage, otherwise login
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
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
}

export default App;