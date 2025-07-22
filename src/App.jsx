// App.jsx
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
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); // New state to track if we've tried to load user initially

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
      console.log("fetchUserProfile: Attempting to fetch /api/user/me with token.");
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
          console.log("fetchUserProfile: Profile not found for this user. Setting currentUser to null.");
          setCurrentUser(null); // Explicitly set to null if profile not found
          return { needsProfileCreation: true, error: false, user: null };
        } else {
          console.log("fetchUserProfile: User profile found. Current user data:", data);
          setCurrentUser(data.user); // Ensure 'data.user' is used if that's where user info resides
          return { needsProfileCreation: false, error: false, user: data.user };
        }
      } else {
        console.error("fetchUserProfile: Response not OK. Status:", response.status, "Data:", data);
        localStorage.removeItem('token');
        setAuthToken(null);
        setCurrentUser(null);
        toast.error(data.message || "Lỗi khi tải hồ sơ người dùng. Vui lòng đăng nhập lại.");
        return { needsProfileCreation: false, error: true, user: null };
      }
    } catch (error) {
      console.error("Error fetching user profile (network/unexpected):", error);
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
  useEffect(() => {
    const initializeUserSession = async () => {
      if (authToken && !isFetchingProfile) { // Only attempt if token exists and not already fetching
        console.log("App.jsx useEffect: Authenticated, attempting to fetch user profile.");
        const profileResult = await fetchUserProfile(authToken);
        if (profileResult && profileResult.needsProfileCreation) {
          console.log("App.jsx useEffect: Profile needs creation, navigating to /create-profile.");
          navigate('/create-profile');
        } else if (profileResult && profileResult.error) {
          console.error("App.jsx useEffect: Error fetching profile, ensuring logout and redirect to login.");
          // fetchUserProfile already handles token removal and setCurrentUser(null)
          navigate('/login');
        }
      } else if (!authToken && !isFetchingProfile && !['/login', '/register', '/forgot-password', '/verify-email', '/reset-password', '/about', '/timeline'].includes(currentPage)) {
        // If no token and not on a public page, redirect to login
        console.log("App.jsx useEffect: No authToken and on protected page, navigating to /login.");
        navigate('/login');
      }
      setInitialLoadAttempted(true); // Mark that we've at least tried to load the user session
    };

    if (!initialLoadAttempted) { // Only run once on mount or if token changes (but initial attempt not done)
      initializeUserSession();
    } else if (authToken && !currentUser && !isFetchingProfile) {
      // This specific condition handles cases where authToken is present but currentUser is somehow lost
      // or not yet set by initialLoadAttempted (e.g., after a login that sets authToken, but profile fetch is pending).
      // Re-attempt fetch if authToken exists but currentUser is null and no fetch is ongoing.
      initializeUserSession();
    }
  }, [authToken, fetchUserProfile, navigate, currentPage, isFetchingProfile, initialLoadAttempted, currentUser]);


  // Effect for post-login/profile update navigation
  useEffect(() => {
    if (authToken && currentUser && initialLoadAttempted) {
      const publicPaths = ['/login', '/register', '/forgot-password', '/verify-email', '/reset-password',  '/'];
      const isOnPublicPage = publicPaths.includes(currentPage);

      if (isOnPublicPage || currentPage === '/') {
        // If authenticated and profile exists, and on a public/root page, navigate to homepage.
        console.log("App.jsx: AuthToken and currentUser exist, redirecting to homepage.");
        navigate('/homepage'); // Redirect to homepage after successful login/profile load
      }
    }
  }, [authToken, currentUser, currentPage, navigate, initialLoadAttempted]);


  const handleLoginSuccess = useCallback(async (token) => {
    console.log("handleLoginSuccess: Token received, setting localStorage...");
    localStorage.setItem('token', token);
    setAuthToken(token);
    // fetchUserProfile will be triggered by the useEffect due to authToken change
    toast.success("Đăng nhập thành công!");
  }, []);

  const handleLogout = useCallback(() => {
    console.log("handleLogout: Clearing session and navigating to login.");
    localStorage.removeItem('token');
    setAuthToken(null);
    setCurrentUser(null);
    setInitialLoadAttempted(false); // Reset this so a fresh session check happens on next login
    toast.info("Bạn đã đăng xuất.");
    navigate('/login');
  }, [navigate]);

  const handleProfileCreatedOrUpdated = useCallback(async () => {
    console.log("handleProfileCreatedOrUpdated: Profile event occurred, re-fetching profile...");
    toast.success("Hồ sơ đã được tạo/cập nhật thành công!");
    if (authToken) {
      await fetchUserProfile(authToken); // This will update currentUser
    }
  }, [authToken, fetchUserProfile]);


  const renderCurrentPage = () => {
    const path = currentPage;
    const token = new URLSearchParams(window.location.search).get('token');

    // Display loading spinner while initial session check is in progress
    if (!initialLoadAttempted && authToken) { // Only show loading if we have a token but haven't tried to load profile yet
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
        // If on profile page but no user data yet (and not loading), redirect to login
        if (!authToken) {
            console.log("App.jsx renderCurrentPage: No authToken for /profile, redirecting to login.");
            navigate('/login');
            return null;
        }
        // Pass currentUser. Profile component will manage its own loading state based on currentUser prop
        return <Profile setCurrentPage={navigate} currentUser={currentUser} authToken={authToken} onProfileUpdate={handleProfileCreatedOrUpdated} />;
      case path === '/create-profile':
        if (!authToken) {
            console.log("App.jsx renderCurrentPage: No authToken for /create-profile, redirecting to login.");
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
        if (!authToken) return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
        return <PersonalWork setCurrentPage={navigate} />;
      case path === '/personal-task':
        if (!authToken) return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
        return <PersonalTask setCurrentPage={navigate} />;
      case path === '/notifications':
        if (!authToken) return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
        return <Notifications setCurrentPage={navigate} />;
      case path === '/chat':
        if (!authToken) return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
        return <Chat setCurrentPage={navigate} />;
      case path === '/about':
        return <About />;
      case path === '/timeline':
        return <Timeline />;
      default:
        // Default route: if authenticated and have profile, go to homepage, else login.
        if (authToken && currentUser) {
          return <Homepage setCurrentPage={navigate} />;
        } else if (!authToken && initialLoadAttempted) { // Only redirect to login if no token AND we've tried to load session
          return <Login setCurrentPage={navigate} onLoginSuccess={handleLoginSuccess} />;
        }
        // Fallback for cases where initialLoadAttempted is false, but we're not on a public path.
        // This can happen briefly. The main useEffect will handle the redirect.
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <p>Đang tải...</p>
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