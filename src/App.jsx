import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Profile from "./components/User/Profile";
import ResetPassword from "./components/User/ResetPassword";
import ForgotPassword from "./components/User/ForgotPassword";
import Homepage from "./components/Homepage";
import Notifications from "./components/Notification";
import Chat from "./components/Chat";
import PersonalWork from "./components/PersonalWork";
import VerifyEmailPage from "./components/User/VerifyEmailPage";
import CreateProfile from "./components/User/CreateProfile";
import PersonalTask from "./components/Task/PersonalTask";
import About from "./components/About";
import Timeline from "./components/Task/Timeline";
import SprintsPage from "./components/Sprint/SprintsPage";
import CreateSprint from "./components/Sprint/CreateSprint";
import Admin from "./components/Admin/Admin";
import AdminReport from "./components/Admin/AdminReport";
import AdminTimeline from "./components/Admin/AdminTimeline";
import MeetingSchedule from "./components/MeetingSchedule";
import SupportRequest from "./components/SupportRequest";
import DocumentsPage from "./components/DocumentsPage"; // Import DocumentsPage

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

function App() {
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null); // currentUser sẽ chứa đối tượng user từ API /users/me
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchingRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState(null, "", path);
    setCurrentPage(path);
  }, []);

  const fetchUserProfile = useCallback(async (token) => {
    if (!token || fetchingRef.current) {
      console.log(
        token
          ? "fetchUserProfile already in progress, skipping."
          : "No token provided to fetchUserProfile."
      );
      return { needsProfileCreation: false, error: false, user: null };
    }

    fetchingRef.current = true;
    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Kiểm tra trực tiếp sự tồn tại và tính hợp lệ của đối tượng user
        if (data.user && data.user._id) {
          setCurrentUser(data.user);
          console.log("Fetched user profile:", data.user);
          return { needsProfileCreation: false, error: false, user: data.user };
        } else {
          // Nếu phản hồi là OK nhưng đối tượng user bị thiếu hoặc không hợp lệ, coi như cần tạo hồ sơ
          setCurrentUser(null);
          console.warn("User profile data missing from API response:", data);
          return { needsProfileCreation: true, error: false, user: null, message: data.message || "Không tìm thấy hồ sơ người dùng." };
        }
      } else {
        setCurrentUser(null);
        console.error("Error fetching profile, response not ok:", data.message);
        // Nếu lỗi HTTP là 404 hoặc thông báo lỗi rõ ràng cho biết không tìm thấy hồ sơ, coi như cần tạo hồ sơ
        if (response.status === 404 || data.message?.includes("Không tìm thấy thông tin người dùng")) {
            return {
                needsProfileCreation: true, // Coi như cần tạo hồ sơ nếu rõ ràng là 404 hoặc thông báo gợi ý
                error: false, // Đây là một trạng thái hợp lệ (chưa có hồ sơ), không phải lỗi trong yêu cầu
                user: null,
                message: data.message || "Không tìm thấy hồ sơ người dùng.",
            };
        }
        return {
          needsProfileCreation: false, // Mặc định là false cho các lỗi khác
          error: true,
          user: null,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Fetch profile network/unexpected error:", error);
      setCurrentUser(null);
      return {
        needsProfileCreation: false,
        error: true,
        user: null,
        message: error.message,
      };
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
    setIsInitializing(true);
    toast.info("Bạn đã đăng xuất.");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      if (authToken) {
        const profileResult = await fetchUserProfile(authToken);
        if (profileResult.needsProfileCreation) {
          toast.warn("Không tìm thấy hồ sơ người dùng. Vui lòng tạo hồ sơ.");
          navigate("/create-profile");
        } else if (profileResult.error) {
          toast.error(
            profileResult.message ||
              "Phiên đăng nhập không hợp lệ hoặc có lỗi. Vui lòng đăng nhập lại."
          );
          handleLogout();
        }
      } else {
        const publicPages = [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/about",
          "/timeline",
          "/documents", // Add /documents to public pages
        ];
        if (
          !publicPages.some((publicPath) => currentPage.startsWith(publicPath))
        ) {
          navigate("/login");
        }
      }
      setIsInitializing(false);
    };

    initializeApp();
  }, [authToken, navigate, fetchUserProfile, currentPage, handleLogout]);

  const handleLoginSuccess = useCallback(
    async (token) => {
      localStorage.setItem("token", token);
      setAuthToken(token);
      toast.success("Đăng nhập thành công!");
      const profileResult = await fetchUserProfile(token);
      if (profileResult.needsProfileCreation) {
        toast.warn("Bạn chưa có hồ sơ. Vui lòng tạo hồ sơ.");
        navigate("/create-profile");
      } else if (profileResult.error) {
        toast.error(
          profileResult.message ||
            "Đăng nhập thành công nhưng không thể tải hồ sơ. Vui lòng thử lại."
        );
        handleLogout();
      } else {
        navigate("/homepage");
      }
    },
    [fetchUserProfile, navigate]
  );

  const handleProfileCreatedOrUpdated = useCallback(async () => {
    toast.success("Hồ sơ đã được tạo/cập nhật thành công!");
    if (authToken) {
      const profileResult = await fetchUserProfile(authToken);
      if (profileResult.user) {
        navigate("/profile");
      } else {
        toast.error(
          "Có lỗi khi tải lại hồ sơ sau khi tạo/cập nhật. Vui lòng thử lại đăng nhập."
        );
        handleLogout();
      }
    }
  }, [authToken, fetchUserProfile, navigate, handleLogout]);

  const renderCurrentPage = () => {
    const path = currentPage;
    const publicPages = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/about",
      "/timeline",
      "/documents", // Keep /documents in public pages for direct access
    ];
    const isPublicPage = publicPages.some((publicPath) =>
      path.startsWith(publicPath)
    );

    if (isInitializing) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <p style={{ marginTop: "16px" }}>
            Đang tải dữ liệu phiên đăng nhập...
          </p>
        </div>
      );
    }

    // NEW LOGIC: Allow public pages even if not authenticated
    if (isPublicPage) {
        switch (true) {
            case path === "/login":
                return (
                    <Login
                        setCurrentPage={navigate}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );
            case path === "/register":
                return <Register setCurrentPage={navigate} />;
            case path === "/forgot-password":
                return <ForgotPassword setCurrentPage={navigate} />;
            case path.startsWith("/reset-password/"):
                const resetToken = path.split("/reset-password/")[1];
                return <ResetPassword setCurrentPage={navigate} token={resetToken} />;
            case path.startsWith("/verify-email/"):
                const emailVerificationToken = path.split("/verify-email/")[1];
                if (!emailVerificationToken) {
                    return (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "80vh",
                            }}
                        >
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
            case path === "/about":
                return <About />;
            case path === "/timeline":
                return <Timeline />;
            case path === "/documents": // Directly render DocumentsPage if it's a public page
                return (
                    <DocumentsPage
                        authToken={authToken} // authToken might be null here if not logged in
                        currentUser={currentUser} // currentUser might be null here if not logged in
                        setCurrentPage={navigate}
                    />
                );
            default:
                // This case should ideally not be hit if all public pages are explicitly handled
                // But as a fallback, if an unknown public path is accessed, direct to login.
                if (!authToken) {
                    navigate("/login");
                    return null;
                }
        }
    }

    // If not a public page AND not authenticated, redirect to login
    if (!authToken) {
      navigate("/login");
      return null;
    }

    // Redirect authenticated users from login/register to homepage
    if (
      (path === "/login" || path === "/register") &&
      authToken &&
      currentUser
    ) {
      navigate("/homepage");
      return null;
    }

    // Redirect authenticated users without a profile to create-profile
    if (
      authToken &&
      !currentUser &&
      path !== "/create-profile" // Ensure we don't redirect from create-profile itself
    ) {
      navigate("/create-profile");
      return null;
    }

    // Helper for pages requiring authentication and user profile
    const commonAuthProtectedPageCheck = () => {
      if (!authToken) {
        // This case should ideally be caught by the general !authToken check above
        navigate("/login");
        return true; // Indicate that navigation happened, component should not render
      }
      if (!currentUser) {
        // If authToken exists but currentUser is null (still loading or profile not found)
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              flexDirection: "column",
            }}
          >
            <CircularProgress />
            <p style={{ marginTop: "16px" }}>
              Đang tải thông tin người dùng...
            </p>
          </div>
        );
      }
      return false; // Indicate that checks passed, component can render
    };

    switch (true) {
      case path === "/profile":
        const profileCheck = commonAuthProtectedPageCheck();
        if (profileCheck === true) return null;
        if (profileCheck !== false) return profileCheck;
        return (
          <Profile
            setCurrentPage={navigate}
            currentUser={currentUser}
            authToken={authToken}
            onProfileUpdate={handleProfileCreatedOrUpdated}
          />
        );
      case path === "/create-profile":
        if (!authToken) {
          navigate("/login");
          return null;
        }
        return (
          <CreateProfile
            setCurrentPage={navigate}
            authToken={authToken}
            onProfileCreated={handleProfileCreatedOrUpdated}
          />
        );
      case path === "/sprints":
        const sprintsCheck = commonAuthProtectedPageCheck();
        if (sprintsCheck === true) return null;
        if (sprintsCheck !== false) return sprintsCheck;
        return (
          <SprintsPage
            authToken={authToken}
            currentUser={currentUser}
            setCurrentPage={navigate}
          />
        );
      case path === "/create-sprint":
        const createSprintCheck = commonAuthProtectedPageCheck();
        if (createSprintCheck === true) return null;
        if (createSprintCheck !== false) return createSprintCheck;
        return (
          <CreateSprint
            authToken={authToken}
            currentUser={currentUser}
            setCurrentPage={navigate}
          />
        );
      case path === "/personal-work":
        const personalWorkCheck = commonAuthProtectedPageCheck();
        if (personalWorkCheck === true) return null;
        if (personalWorkCheck !== false) return personalWorkCheck;
        return <PersonalWork setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;
      case path === "/personal-task":
        const personalTaskCheck = commonAuthProtectedPageCheck();
        if (personalTaskCheck === true) return null;
        if (personalTaskCheck !== false) return personalTaskCheck;
        return (
          <PersonalTask
            setCurrentPage={navigate}
            authToken={authToken}
            currentUserId={currentUser._id}
          />
        );
      case path === "/notifications":
        const notificationsCheck = commonAuthProtectedPageCheck();
        if (notificationsCheck === true) return null;
        if (notificationsCheck !== false) return notificationsCheck;
        return <Notifications setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;
      case path === "/chat":
        const chatCheck = commonAuthProtectedPageCheck();
        if (chatCheck === true) return null;
        if (chatCheck !== false) return chatCheck;
        return <Chat setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;

      // ===== ADMIN ROUTES =====
      case path === "/admin":
        if (!authToken || !currentUser) {
          toast.error("Bạn không có quyền truy cập trang Admin.");
          navigate("/homepage");
          return null;
        }
        if (currentUser.roleTag !== "ADMIN") {
          toast.error("Bạn không có quyền truy cập trang Admin.");
          navigate("/homepage");
          return null;
        }
        return (
          <Admin
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      case path === "/admin-report":
        if (!authToken || !currentUser || currentUser.roleTag !== "ADMIN") {
          toast.error("Bạn không có quyền truy cập báo cáo.");
          navigate("/homepage");
          return null;
        }
        return (
          <AdminReport
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      case path === "/admin-timeline":
        if (!authToken || !currentUser || currentUser.roleTag !== "ADMIN") {
          toast.error("Bạn không có quyền truy cập timeline quản trị.");
          navigate("/homepage");
          return null;
        }
        return (
          <AdminTimeline
            setCurrentPage={navigate}
            authToken={authToken}
            currentUser={currentUser}
          />
        );

      case path === "/meeting-schedule":
        const meetingScheduleCheck = commonAuthProtectedPageCheck();
        if (meetingScheduleCheck === true) return null;
        if (meetingScheduleCheck !== false) return meetingScheduleCheck;
        return <MeetingSchedule setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;

      case path === "/support-request":
        const supportRequestCheck = commonAuthProtectedPageCheck();
        if (supportRequestCheck === true) return null;
        if (supportRequestCheck !== false) return supportRequestCheck;
        return <SupportRequest setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;

      // Removed DocumentsPage from here as it's now handled as a public page
      
      case path === "/homepage":
      case path === "/":
        const homepageCheck = commonAuthProtectedPageCheck();
        if (homepageCheck === true) return null;
        if (homepageCheck !== false) return homepageCheck;
        return <Homepage setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;
        
      default:
        // If it's not a known public page and not authenticated, redirect to login
        // If it's an unknown authenticated route, redirect to homepage
        if (authToken && currentUser) {
          navigate("/homepage");
        } else {
          navigate("/login");
        }
        return null;
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {renderCurrentPage()}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;