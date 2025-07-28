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
import PersonalTask from "./components/Task/PersonalTask"; // Đảm bảo import đúng
import About from "./components/About";
import Timeline from "./components/Task/Timeline";
import SprintsPage from "./components/Sprint/SprintsPage";
import CreateSprint from "./components/Sprint/CreateSprint";
import Admin from "./components/Admin/Admin";
import AdminReport from "./components/Admin/AdminReport";
import AdminTimeline from "./components/Admin/AdminTimeline";
import MeetingSchedule from "./components/MeetingSchedule";
import SupportRequest from "./components/SupportRequest";

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
        if (data.message?.includes("Không tìm thấy thông tin người dùng")) {
          setCurrentUser(null);
          return { needsProfileCreation: true, error: false, user: null };
        } else {
          setCurrentUser(data.user); // data.user là đối tượng user bạn đã gửi
          console.log("Fetched user profile:", data.user); // Debugging
          return { needsProfileCreation: false, error: false, user: data.user };
        }
      } else {
        setCurrentUser(null);
        console.error("Error fetching profile, response not ok:", data.message);
        return {
          needsProfileCreation: false,
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

    // Redirect to login if not authenticated and not a public page
    if (!isPublicPage && !authToken) {
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
      !isPublicPage &&
      path !== "/create-profile"
    ) {
      navigate("/create-profile");
      return null;
    }

    // Helper for pages requiring authentication and user profile
    const commonAuthProtectedPageCheck = () => {
      if (!authToken) {
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
        // Dòng này cần được kiểm tra quyền và user
        const personalWorkCheck = commonAuthProtectedPageCheck();
        if (personalWorkCheck === true) return null;
        if (personalWorkCheck !== false) return personalWorkCheck;
        return <PersonalWork setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />; // Giả định PersonalWork cũng cần currentUser
      case path === "/personal-task":
        const personalTaskCheck = commonAuthProtectedPageCheck(); // <-- Sử dụng hàm kiểm tra quyền
        if (personalTaskCheck === true) return null; // Nếu đã chuyển hướng
        if (personalTaskCheck !== false) return personalTaskCheck; // Nếu đang hiển thị spinner

        // Nếu tất cả các kiểm tra đều qua, truyền currentUser._id
        return (
          <PersonalTask
            setCurrentPage={navigate}
            authToken={authToken}
            currentUserId={currentUser._id} // <-- THAY ĐỔI QUAN TRỌNG NHẤT Ở ĐÂY
          />
        );
      case path === "/notifications":
        // Dòng này cần được kiểm tra quyền và user
        const notificationsCheck = commonAuthProtectedPageCheck();
        if (notificationsCheck === true) return null;
        if (notificationsCheck !== false) return notificationsCheck;
        return <Notifications setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />; // Giả định Notifications cũng cần
      case path === "/chat":
        // Dòng này cần được kiểm tra quyền và user
        const chatCheck = commonAuthProtectedPageCheck();
        if (chatCheck === true) return null;
        if (chatCheck !== false) return chatCheck;
        return <Chat setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />; // Giả định Chat cũng cần
      case path === "/about":
        return <About />;
      case path === "/timeline":
        return <Timeline />;

      // ===== ADMIN ROUTES =====
      case path === "/admin":
        // Kiểm tra quyền ADMIN ở đây
        if (!authToken || !currentUser) {
          toast.error("Bạn không có quyền truy cập trang Admin.");
          navigate("/homepage");
          return null;
        }
        if (currentUser.roleTag !== "ADMIN") { // Thêm kiểm tra roleTag
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
        // Kiểm tra quyền ADMIN ở đây
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
        // Kiểm tra quyền ADMIN ở đây
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

      case path === "/homepage":
      case path === "/":
        // Homepage cũng là trang được bảo vệ
        const homepageCheck = commonAuthProtectedPageCheck();
        if (homepageCheck === true) return null;
        if (homepageCheck !== false) return homepageCheck;
        return <Homepage setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />; // Giả định Homepage cũng cần
      
      case path === "/meeting-schedule": // Thêm route mới nếu chưa có
        const meetingScheduleCheck = commonAuthProtectedPageCheck();
        if (meetingScheduleCheck === true) return null;
        if (meetingScheduleCheck !== false) return meetingScheduleCheck;
        return <MeetingSchedule setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;

      case path === "/support-request": // Thêm route mới nếu chưa có
        const supportRequestCheck = commonAuthProtectedPageCheck();
        if (supportRequestCheck === true) return null;
        if (supportRequestCheck !== false) return supportRequestCheck;
        return <SupportRequest setCurrentPage={navigate} authToken={authToken} currentUser={currentUser} />;


      default:
        if (authToken && currentUser) {
          navigate("/homepage");
          return null;
        }
        // Fallback for unauthenticated users on unknown routes
        navigate("/login"); // Chuyển hướng về trang đăng nhập
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