// Profile.jsx
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
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // Remove error state

  const [personalEmail, setPersonalEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    // If currentUser prop is already available, use it to populate fields
    if (currentUser) {
      console.log("Profile.jsx: Populating fields from currentUser prop.");
      setPersonalEmail(currentUser.personalEmail || '');
      setName(currentUser.name || '');
      setPhoneNumber(currentUser.phoneNumber || '');
      setDob(currentUser.dob ? currentUser.dob.split('T')[0] : '');
      setBio(currentUser.bio || '');
      setRole(currentUser.role || '');
      setOriginalData({ ...currentUser });
      setLoading(false); // Data is available, no need for loading
      // setError(null); // Clear previous errors
    } else {
      // If currentUser is null, need to fetch data or redirect if no token
      const loadProfileData = async () => {
        if (!authToken) {
          console.log("Profile.jsx: No authToken, redirecting to login.");
          setCurrentPage('/login');
          return;
        }
        setLoading(true); // Start loading only if data is not yet available
        // setError(null); // Clear previous errors
        try {
          const user = await onProfileUpdate(authToken); // Call fetchUserProfile from App.jsx
          if (user && !user.needsProfileCreation) { // Check for valid user and no profile creation needed
            console.log("Profile.jsx: Fetched user data successfully.");
            setPersonalEmail(user.personalEmail || '');
            setName(user.name || '');
            setPhoneNumber(user.phoneNumber || '');
            setDob(user.dob ? user.dob.split('T')[0] : '');
            setBio(user.bio || '');
            setRole(user.role || '');
            setOriginalData({ ...user });
          } else { // If user is null or needsProfileCreation, it means profile does not exist
            console.log("Profile.jsx: Profile not found or needs creation, redirecting to create-profile.");
            toast.error('Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.'); // Use toast.error
            setCurrentPage('/create-profile'); // Redirect to create profile page
          }
        } catch (err) {
          console.error('Profile.jsx: Error loading profile:', err);
          toast.error('Lỗi khi tải hồ sơ. Vui lòng thử lại.'); // Use toast.error
        } finally {
          setLoading(false);
        }
      };
      // Only load data if currentUser is not yet set
      if (!currentUser) {
        loadProfileData();
      }
    }
  }, [currentUser, authToken, setCurrentPage, onProfileUpdate]); // Dependencies on currentUser, authToken, setCurrentPage, onProfileUpdate

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalData({ personalEmail, name, phoneNumber, dob, bio, role });
    }
  };

  const handleSave = async () => {
    const updatedData = { personalEmail, name, phoneNumber, dob, bio, };
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
        toast.success('Hồ sơ đã được cập nhật thành công!'); // Add success toast
        setIsEditing(false);
        await onProfileUpdate(authToken);
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        toast.error(errorData.message || 'Cập nhật hồ sơ thất bại.'); // Use toast.error
      }
    } catch (err) {
      console.error('Network error or unexpected issue when updating profile:', err);
      toast.error('Đã xảy ra lỗi mạng khi cập nhật hồ sơ. Vui lòng thử lại.'); // Use toast.error
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <MainContent>
          <Box sx={{ maxWidth: "900px", mx: "auto", my: 4 }}>
            <CoverImage />
            <ProfileHeader>
              <Avatar
                src={currentUser?.avatarUrl || "/static/images/avatar/1.jpg"} // Replace with actual avatar URL
                sx={{ width: 120, height: 120 }}
              />
              <Box>
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

            {/* Remove Typography error display here if it was used for state error
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            */}

            <SettingTitle variant="h5">Thông tin cá nhân</SettingTitle>
            <FormContainer>
              <Grid container spacing={3}> {/* Changed Grid container spacing */}
                <Grid item xs={12} sm={6}> {/* Changed Grid xs to Grid item xs and added sm */}
                  {renderField("Email Cá Nhân", personalEmail, setPersonalEmail, "email")}
                </Grid>
                <Grid item xs={12} sm={6}> {/* Changed Grid xs to Grid item xs and added sm */}
                  {renderField("Tên", name, setName)}
                </Grid>
                <Grid item xs={12} sm={6}> {/* Changed Grid xs to Grid item xs and added sm */}
                  {renderField("Số Điện Thoại", phoneNumber, setPhoneNumber, "tel")}
                </Grid>
                <Grid item xs={12} sm={6}> {/* Changed Grid xs to Grid item xs and added sm */}
                  {renderField("Ngày Sinh", dob, setDob, "date")}
                </Grid>
                <Grid item xs={12}> {/* Changed Grid xs to Grid item xs */}
                  {renderField("Tiểu sử", bio, setBio, "text", true, 4)}
                </Grid>
                <Grid item xs={12}> {/* Changed Grid xs to Grid item xs */}
                  {renderField("Vai trò", role, setRole, "text", false, 1, null, true)} {/* Role is not editable */}
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