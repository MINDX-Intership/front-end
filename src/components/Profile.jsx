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
import { toast } from 'react-toastify'; // Import toast

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
  const [loading, setLoading] = useState(true); // Start as true, will be set to false once currentUser is available or fetched

  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (currentUser) {
      console.log("Profile.jsx: Populating fields from currentUser prop.");
      setPersonalEmail(currentUser.personalEmail || '');
      setName(currentUser.name || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setDob(currentUser.dob ? currentUser.dob.split('T')[0] : '');
      setBio(currentUser.bio || '');
      setRole(currentUser.role || '');
      setOriginalData({ ...currentUser });
      setLoading(false); // Data is available from props, stop loading
    } else if (authToken) {
      // If currentUser is null but authToken is present,
      // it means App.jsx might not have completed its initial fetch yet,
      // or a direct navigation occurred before currentUser was set.
      // Trigger a fetch through onProfileUpdate.
      const loadProfileData = async () => {
        setLoading(true); // Show loading while fetching
        console.log("Profile.jsx: currentUser is null but authToken exists, attempting to fetch via onProfileUpdate.");
        const profileResult = await onProfileUpdate(authToken);
        if (profileResult && profileResult.user) {
            // If onProfileUpdate successfully fetched a user, fields will be populated by currentUser prop changing
        } else if (profileResult && profileResult.needsProfileCreation) {
            toast.error('Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.');
            setCurrentPage('/create-profile');
        } else if (profileResult && profileResult.error) {
            toast.error('Lỗi khi tải hồ sơ. Vui lòng thử lại.');
            setCurrentPage('/login');
        } else {
            // Unexpected case, navigate to login
            setCurrentPage('/login');
        }
        setLoading(false); // Hide loading after fetch attempt
      };
      loadProfileData();
    } else {
        // No authToken, no currentUser, navigate to login if not already there
        if (setCurrentPage && window.location.pathname !== '/login') { // Prevent infinite loop
            console.log("Profile.jsx: No authToken, no currentUser, redirecting to login.");
            setCurrentPage('/login');
        }
        setLoading(false); // No loading if no token
    }
  }, [currentUser, authToken, setCurrentPage, onProfileUpdate]);


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // When entering edit mode, save the current displayed values as original
      setOriginalData({ personalEmail, name, phoneNumber, dob, bio, role });
    }
  };

  const handleSave = async () => {
    // Tạo một đối tượng chỉ chứa các trường đã thay đổi
    const changes = {};
    if (personalEmail !== originalData.personalEmail) {
      changes.personalEmail = personalEmail;
    }
    if (name !== originalData.name) {
      changes.name = name;
    }
    if (phoneNumber !== originalData.phoneNumber) {
      changes.phoneNumber = phoneNumber;
    }
    if (dob !== originalData.dob) {
      changes.dob = dob;
    }
    if (bio !== originalData.bio) {
      changes.bio = bio;
    }
    // Không cần gửi role vì nó là trường disable/không chỉnh sửa được

    // Kiểm tra xem có thay đổi nào không trước khi gửi request
    if (Object.keys(changes).length === 0) {
      toast.info('Không có thay đổi nào để lưu.');
      setIsEditing(false); // Thoát chế độ chỉnh sửa nếu không có thay đổi
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(changes), // Gửi chỉ những trường đã thay đổi
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile updated successfully:', data);
        toast.success('Hồ sơ đã được cập nhật thành công!');
        setIsEditing(false);
        // Sau khi cập nhật thành công, gọi onProfileUpdate để App.jsx fetch lại profile mới nhất
        await onProfileUpdate(authToken);
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        toast.error(errorData.message || 'Cập nhật hồ sơ thất bại.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue when updating profile:', err);
      toast.error('Đã xảy ra lỗi mạng khi cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert to original data
    setPersonalEmail(originalData.personalEmail || '');
    setName(originalData.name || '');
    setPhoneNumber(originalData.phoneNumber || '');
    setDob(originalData.dob ? originalData.dob.split('T')[0] : '');
    setBio(originalData.bio || '');
    setRole(originalData.role || '');
  };

  const renderField = (label, value, setter, type = "text", editable = true, multilineRows = 1, helperText = null, disabled = false) => (
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

  // Show loading while data is being fetched or processed
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Root>
          <MainContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Đang tải hồ sơ...</Typography>
          </MainContent>
        </Root>
      </ThemeProvider>
    );
  }

  // If currentUser is null after loading attempt (e.g., token invalid, profile not found)
  // and we are not in a loading state, we should not render the profile form.
  // The useEffect or App.jsx's render logic should have redirected by now.
  if (!currentUser) {
      return null; // Or a message indicating no profile data
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <MainContent>
          <Box sx={{ maxWidth: "900px", mx: "auto", my: 4 }}>
            <CoverImage />
            <ProfileHeader>
              <Avatar
                src={currentUser?.avatarUrl || "/static/images/avatar/1.jpg"} // Use currentUser directly
                sx={{ mt:2 ,width: 120, height: 120 }}
              />
              <Box sx={{my: 0 }}>
                <ProfileName variant="h4">{currentUser?.name || "Người dùng"}</ProfileName>
                <UserBio variant="body1">
                  {bio || "Chưa có tiểu sử."}
                </UserBio>
              </Box>
            </ProfileHeader>

            <ActionButtons>
              {isEditing ? (
                <>
                  <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}>Lưu</Button>
                  <Button variant="outlined" onClick={handleCancel} sx={{ borderColor: '#e0e0e0', color: '#6c757d', '&:hover': { bgcolor: 'rgba(108, 117, 125, 0.04)' } }}>Hủy</Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleEditToggle} sx={{ bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' } }}>Chỉnh sửa hồ sơ</Button>
              )}
            </ActionButtons>

            <SettingTitle variant="h5">Thông tin cá nhân</SettingTitle>
            <FormContainer>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  {renderField("Email Cá Nhân", personalEmail, setPersonalEmail, "email")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField("Tên", name, setName)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField("Số Điện Thoại", phoneNumber, setPhoneNumber, "tel")}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderField("Ngày Sinh", dob, setDob, "date")}
                </Grid>
                <Grid item xs={12}>
                  {renderField("Tiểu sử", bio, setBio, "text", true, 4)}
                </Grid>
                <Grid item xs={12}>
                  {renderField("Vai trò", role, setRole, "text", false, 1, null, true)}
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