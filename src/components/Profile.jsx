import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid, // Giữ Grid
  styled,
  Paper,
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
}));

const FormField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: theme.palette.divider },
    "&:hover fieldset": { borderColor: theme.palette.primary.main },
    "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
  },
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // Nếu currentUser prop đã có sẵn, sử dụng nó để điền vào các trường
    if (currentUser) {
      console.log("Profile.jsx: Populating fields from currentUser prop.");
      setPersonalEmail(currentUser.personalEmail || '');
      setName(currentUser.name || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setDob(currentUser.dob ? currentUser.dob.split('T')[0] : '');
      setBio(currentUser.bio || '');
      setRole(currentUser.role || '');
      setOriginalData({ ...currentUser });
      setLoading(false); // Dữ liệu đã có, không cần loading
      setError(null); // Xóa lỗi cũ
    } else {
      // Nếu currentUser là null, cần fetch dữ liệu hoặc chuyển hướng nếu không có token
      const loadProfileData = async () => {
        if (!authToken) {
          console.log("Profile.jsx: No authToken, redirecting to login.");
          setCurrentPage('/login');
          return;
        }
        setLoading(true); // Bắt đầu loading chỉ khi dữ liệu chưa có
        setError(null);
        try {
          const user = await onProfileUpdate(authToken); // Gọi fetchUserProfile từ App.jsx
          if (user && !user.needsProfileCreation) { // Kiểm tra user hợp lệ và không cần tạo profile
            console.log("Profile.jsx: Fetched user data successfully.");
            setPersonalEmail(user.personalEmail || '');
            setName(user.name || '');
            setPhoneNumber(user.phoneNumber || '');
            setDob(user.dob ? user.dob.split('T')[0] : '');
            setBio(user.bio || '');
            setRole(user.role || '');
            setOriginalData({ ...user });
          } else {
            // Nếu user là null hoặc needsProfileCreation, nghĩa là profile không tồn tại
            console.log("Profile.jsx: Profile not found or needs creation, redirecting to create-profile.");
            setError('Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.');
            setCurrentPage('/create-profile'); // Chuyển hướng đến trang tạo profile
          }
        } catch (err) {
          console.error('Profile.jsx: Error loading profile:', err);
          setError('Lỗi khi tải hồ sơ. Vui lòng thử lại.');
        } finally {
          setLoading(false);
        }
      };

      // Chỉ load dữ liệu nếu currentUser chưa được set
      if (!currentUser) {
        loadProfileData();
      }
    }
  }, [currentUser, authToken, setCurrentPage, onProfileUpdate]); // Phụ thuộc vào currentUser, authToken, setCurrentPage, onProfileUpdate

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalData({
        personalEmail, name, phoneNumber, dob, bio, role
      });
    }
  };

  const handleSave = async () => {
    const updatedData = {
      personalEmail,
      name,
      phoneNumber,
      dob,
      bio,
    };

    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        setIsEditing(false);
        await onProfileUpdate(authToken);
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        setError(errorData.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Network error during profile update:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleCancel = () => {
    setPersonalEmail(originalData.personalEmail || '');
    setName(originalData.name || '');
    setPhoneNumber(originalData.phoneNumber || '');
    setDob(originalData.dob ? originalData.dob.split('T')[0] : '');
    setBio(originalData.bio || '');
    setRole(originalData.role || '');
    setIsEditing(false);
  };

  const renderField = (
    label,
    value,
    onChange,
    type = "text",
    multiline = false,
    rows = 1,
    adornment = null,
    disabled = false
  ) => (
    <FormField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!isEditing || disabled}
      fullWidth
      variant="outlined"
      type={type}
      multiline={multiline}
      rows={rows}
      InputProps={adornment ? { startAdornment: adornment } : {}}
      InputLabelProps={type === "date" || label === "Vai trò" ? { shrink: true } : {}}
    />
  );

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Root>
          <MainContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Đang tải hồ sơ...</Typography>
          </MainContent>
        </Root>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Root>
          <MainContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h6" color="error" sx={{ mt: 4 }}>Lỗi: {error}</Typography>
            <Button variant="contained" onClick={() => setCurrentPage('/create-profile')} sx={{ mt: 2 }}>
              Tạo hồ sơ ngay
            </Button>
          </MainContent>
        </Root>
      </ThemeProvider>
    );
  }

  // If currentUser is null after loading, it means profile doesn't exist
  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <Root>
          <MainContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h6" sx={{ mt: 4 }}>Hồ sơ chưa được tạo.</Typography>
            <Button variant="contained" onClick={() => setCurrentPage('/create-profile')} sx={{ mt: 2 }}>
              Tạo hồ sơ ngay
            </Button>
          </MainContent>
        </Root>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <MainContent>
          <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: "auto" }}>
            <CoverImage />
            <div style={{ 'display': 'flex' }}>
              <ProfileHeader>
                <Avatar
                  alt="User Profile"
                  src="https://i0.wp.com/dappchap.com/wp-content/uploads/2018/04/toni-hukkanen-GeWnWHgGXls-unsplash.jpg?ssl=1" // Placeholder or dynamic image
                  sx={{ width: 120, height: 120 }}
                />
              </ProfileHeader>
              <Box>
                <ProfileName style={{}} variant="h4">
                  {currentUser.name || 'Người dùng mới'}
                </ProfileName>
                <UserBio variant="body1">{currentUser.bio || 'Chưa có tiểu sử.'}</UserBio>
              </Box>
            </div>
            <ActionButtons>
              {isEditing ? (
                <>
                  <Button variant="outlined" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEditToggle}>
                  Chỉnh sửa hồ sơ
                </Button>
              )}
            </ActionButtons>

            <SettingTitle variant="h5">Chi tiết của tôi</SettingTitle>
            <FormContainer>
              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}> {/* Cập nhật cú pháp Grid */}
                  {renderField("Họ và Tên", name, setName)}
                </Grid>
                <Grid xs={12} sm={6}> {/* Cập nhật cú pháp Grid */}
                  {renderField(
                    "Email Cá Nhân",
                    personalEmail,
                    setPersonalEmail,
                    "email",
                    false,
                    1,
                    <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                      <Typography
                        component="span"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        ✉️
                      </Typography>
                    </Box>,
                    false // Email cá nhân có thể chỉnh sửa
                  )}
                </Grid>
                <Grid xs={12} sm={6}> {/* Cập nhật cú pháp Grid */}
                  {renderField(
                    "Số Điện Thoại",
                    phoneNumber,
                    setPhoneNumber,
                    "tel"
                  )}
                </Grid>
                <Grid xs={12} sm={6}> {/* Cập nhật cú pháp Grid */}
                  {renderField("Ngày Sinh", dob, setDob, "date")}
                </Grid>
                <Grid xs={12}> {/* Cập nhật cú pháp Grid */}
                  {renderField("Tiểu sử", bio, setBio, "text", true, 4)}
                </Grid>
                <Grid xs={12}> {/* Cập nhật cú pháp Grid */}
                  {renderField("Vai trò", role, setRole, "text", false, 1, null, true)} {/* Vai trò không chỉnh sửa */}
                </Grid>
              </Grid>
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
                <CloudUploadIcon
                  sx={{ fontSize: 32, color: theme.palette.text.secondary }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Nhấp để tải lên hoặc kéo và thả
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.text.secondary }}
                >
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
