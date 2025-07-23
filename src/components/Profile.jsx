import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  styled,
  Paper,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const theme = createTheme({
  palette: {
    primary: { main: "#4a90e2" },
    secondary: { main: "#6c757d" },
    background: { default: "#f9f9f9", paper: "#ffffff" },
    text: { primary: "#333", secondary: "#888" },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: { fontWeight: 600, fontSize: "1.5rem" },
    body1: { lineHeight: 1.6 },
    button: { textTransform: "none" },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20 },
        outlined: {
          borderColor: "#e0e0e0",
          "&:hover": { backgroundColor: "rgba(74, 144, 226, 0.04)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root.Mui-disabled": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "4px solid #ffffff",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  display: "flex",
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
  marginTop: "0px",
}));

const CoverImage = styled(Box)({
  width: "100%",
  height: "200px",
  backgroundColor: "#ccc",
  backgroundImage:
    "url('https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: theme.shape.borderRadius,
});

// Added styled components for custom info layout
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "20px",
  width: "100%",
}));

const InfoField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    fontSize: "0.95rem",
  },
  "& .MuiInputBase-root": {
    color: theme.palette.text.primary,
    fontSize: "1.15rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "& .Mui-disabled": {
    color: theme.palette.text.secondary,
    WebkitTextFillColor: theme.palette.text.secondary,
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: theme.spacing(-10),
  position: "relative",
  zIndex: 1,
}));

const ProfileName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const UserBio = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  maxWidth: "600px",
  marginTop: theme.spacing(1),
}));

const SettingTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const FileUploadArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: "rgba(74, 144, 226, 0.05)",
  },
  transition: theme.transitions.create(["border-color", "background-color"]),
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  justifyContent: "flex-end",
  marginTop: theme.spacing(4),
}));

function SettingPage({ setCurrentPage, currentUser, authToken, onProfileUpdate }) {
  // State for editing mode and loading status
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for profile fields
  const [personalEmail, setPersonalEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");

  // State to store original data for cancellation
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setPersonalEmail(currentUser.personalEmail || "");
      setName(currentUser.name || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setDob(currentUser.dob ? currentUser.dob.split("T")[0] : "");
      setBio(currentUser.bio || "");
      setRole(currentUser.role || "");
      setOriginalData({ ...currentUser });
      setLoading(false);
    } else if (authToken) {
      const loadProfileData = async () => {
        setLoading(true);
        const profileResult = await onProfileUpdate(authToken);
        if (profileResult && profileResult.needsProfileCreation) {
          toast.error("Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.");
          setCurrentPage("/create-profile");
        } else if (profileResult && profileResult.error) {
          toast.error("Lỗi khi tải hồ sơ. Vui lòng thử lại.");
          setCurrentPage("/login");
        } else {
          setCurrentPage("/login");
        }
        setLoading(false);
      };
      loadProfileData();
    } else {
      if (setCurrentPage && window.location.pathname !== "/login") {
        setCurrentPage("/login");
      }
      setLoading(false);
    }
  }, [currentUser, authToken, setCurrentPage, onProfileUpdate]);

  // Handlers
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalData({ personalEmail, name, phoneNumber, dob, bio, role });
    }
  };

  const handleSave = async () => {
    const changes = {};
    if (personalEmail !== originalData.personalEmail) changes.personalEmail = personalEmail;
    if (name !== originalData.name) changes.name = name;
    if (phoneNumber !== originalData.phoneNumber) changes.phoneNumber = phoneNumber;
    if (dob !== originalData.dob) changes.dob = dob;
    if (bio !== originalData.bio) changes.bio = bio;

    if (Object.keys(changes).length === 0) {
      toast.info("Không có thay đổi nào để lưu.");
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(changes),
      });
      if (response.ok) {
        toast.success("Hồ sơ đã được cập nhật thành công!");
        setIsEditing(false);
        await onProfileUpdate(authToken);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Cập nhật hồ sơ thất bại.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi mạng khi cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPersonalEmail(originalData.personalEmail || "");
    setName(originalData.name || "");
    setPhoneNumber(originalData.phoneNumber || "");
    setDob(originalData.dob ? originalData.dob.split("T")[0] : "");
    setBio(originalData.bio || "");
    setRole(originalData.role || "");
  };

  const renderField = (
    label,
    value,
    setter,
    type = "text",
    editable = true,
    multilineRows = 1,
    helperText = null,
    disabled = false
  ) => (
    <FormField
      label={label}
      value={value}
      onChange={setter ? (e) => setter(e.target.value) : null}
      fullWidth
      margin="normal"
      variant="outlined"
      type={type}
      multiline={multilineRows > 1}
      rows={multilineRows}
      disabled={!isEditing || disabled}
      helperText={helperText}
    />
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Root>
          <MainContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Đang tải hồ sơ...
            </Typography>
          </MainContent>
        </Root>
      </ThemeProvider>
    );
  }

  if (!currentUser) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <MainContent>
          <Box sx={{ maxWidth: "900px", mx: "auto", my: 4 }}>
            <CoverImage />
            <ProfileHeader>
              <Avatar
                src={currentUser?.avatarUrl || "/static/images/avatar/1.jpg"}
                sx={{ mt: 2, width: 120, height: 120 }}
              />
              <Box sx={{ my: 0 }}>
                <ProfileName variant="h4">{currentUser?.name || "Người dùng"}</ProfileName>
                <UserBio variant="body1">{bio || "Chưa có tiểu sử."}</UserBio>
              </Box>
            </ProfileHeader>

            <ActionButtons>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      bgcolor: "#4a90e2",
                      "&:hover": { bgcolor: "#357abd" },
                    }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#6c757d",
                      "&:hover": { bgcolor: "rgba(108, 117, 125, 0.04)" },
                    }}
                  >
                    Hủy
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleEditToggle}
                  sx={{ bgcolor: "#4a90e2", "&:hover": { bgcolor: "#357abd" } }}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </ActionButtons>

            <SettingTitle variant="h5">Thông tin cá nhân</SettingTitle>
            <FormContainer>
              <InfoRow>
                <InfoField
                  label="Email Cá Nhân"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  disabled={!isEditing}
                  type="email"
                  InputLabelProps={{ shrink: true }}
                />
              </InfoRow>
              <InfoRow>
                <InfoField
                  label="Tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
                <InfoField
                  label="Số Điện Thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  type="tel"
                  InputLabelProps={{ shrink: true }}
                />
                <InfoField
                  label="Ngày Sinh"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <InfoField
                  label="Vai trò"
                  value={role}
                  disabled
                  InputLabelProps={{ shrink: true }}
                />
              </InfoRow>
              {/* Tiểu sử nguyên dòng, multiline */}
              <InfoRow>
                <InfoField
                  label="Tiểu sử"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                  multiline
                  minRows={3}
                  InputLabelProps={{ shrink: true }}
                />
              </InfoRow>
            </FormContainer>

            <SettingTitle variant="h5">Tải ảnh lên</SettingTitle>
            <FileUploadArea>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Nhấp để tải lên hoặc kéo và thả
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  SVG, PNG, JPG hoặc GIF (tối đa 800x400px)
                </Typography>
              </Box>
            </FileUploadArea>
          </Box>
        </MainContent>
      </Root>
    </ThemeProvider>
  );
}

export default SettingPage;
