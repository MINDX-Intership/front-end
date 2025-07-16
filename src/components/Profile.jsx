import { useState } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Định nghĩa theme Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#4a90e2",
    },
    secondary: {
      main: "#6c757d",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#333",
      secondary: "#888",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
        outlined: {
          borderColor: "#e0e0e0",
          "&:hover": {
            backgroundColor: "rgba(74, 144, 226, 0.04)",
          },
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

// Các styled component
const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  display: "flex",
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  marginTop: "0px",
}));

const CoverImage = styled(Box)({
  width: "100%",
  height: "200px",
  backgroundColor: "#ccc",
  backgroundImage:
    "url('https://via.placeholder.com/1200x200?text=Cover+Image')",
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
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
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

/**
 * SettingPage component hiển thị và cho phép chỉnh sửa thông tin hồ sơ người dùng.
 */
function SettingPage() {
  const [isEditing, setIsEditing] = useState(false);

  // Dữ liệu người dùng mặc định
  const defaultUserData = {
    firstName: "Killan",
    lastName: "James",
    email: "killanjames@gmail.com",
    country: "USA",
    city: "New York",
    phoneNumber: "+1 234 567 890",
    bio: "Hello world Hello world Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world",
    role: "Product Designer",
  };

  // States cho từng trường có thể chỉnh sửa
  const [firstName, setFirstName] = useState(defaultUserData.firstName);
  const [lastName, setLastName] = useState(defaultUserData.lastName);
  const [email, setEmail] = useState(defaultUserData.email);
  const [country, setCountry] = useState(defaultUserData.country);
  const [city, setCity] = useState(defaultUserData.city);
  const [phoneNumber, setPhoneNumber] = useState(defaultUserData.phoneNumber);
  const [bio, setBio] = useState(defaultUserData.bio);
  const [role, setRole] = useState(defaultUserData.role);

  // Chức năng bật/tắt chế độ chỉnh sửa
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Chức năng lưu thay đổi
  const handleSave = () => {
    console.log("Saving data:", {
      firstName,
      lastName,
      email,
      country,
      city,
      phoneNumber,
      bio,
      role,
    });
    setIsEditing(false);
  };
  // Chức năng hủy chỉnh sửa
  const handleCancel = () => {
    setFirstName(defaultUserData.firstName);
    setLastName(defaultUserData.lastName);
    setEmail(defaultUserData.email);

    setCountry(defaultUserData.country);
    setCity(defaultUserData.city);
    setPhoneNumber(defaultUserData.phoneNumber);
    setBio(defaultUserData.bio);
    setRole(defaultUserData.role);
    setIsEditing(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Root>
        <MainContent>
          <Box sx={{ flexGrow: 1, maxWidth: 1200, mx: "auto" }}>
            {/* Phần ảnh bìa và avatar */}
            <CoverImage />
            <ProfileHeader>
              <Avatar
                alt="User Profile"
                src="https://via.placeholder.com/120?text=Profile"
                sx={{ width: 120, height: 120 }}
              />
              <Box>
                <ProfileName variant="h4">
                  {firstName} {lastName}
                </ProfileName>
                <UserBio variant="body1">{bio}</UserBio>
              </Box>
            </ProfileHeader>

            {/* Nút hành động (Chỉnh sửa, Lưu, Hủy) */}
            <ActionButtons>
              {isEditing ? (
                <>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save changes
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleEditToggle}>
                  Edit profile
                </Button>
              )}
            </ActionButtons>

            {/* Phần "My details" */}
            <SettingTitle variant="h5">My details</SettingTitle>
            <FormContainer>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="First name"
                    placeholder="Killan"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Last name"
                    placeholder="James"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Email"
                    placeholder="killanjames@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                          <Typography component="span" sx={{ color: theme.palette.text.secondary }}>
                            ✉️
                          </Typography>
                        </Box>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Phone number"
                    placeholder="+1 234 567 890"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Country"
                    placeholder="USA"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    label="City"
                    placeholder="New York"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormField
                    label="Bio"
                    placeholder="Write a short bio about yourself..."
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormField
                    label="Role"
                    placeholder="Product Designer"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={!isEditing}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </FormContainer>

            {/* Phần "Upload photo" */}
            <SettingTitle variant="h5">Upload photo</SettingTitle>
            <FileUploadArea>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 32, color: theme.palette.text.secondary }} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  SVG, PNG, JPG or GIF (max. 800x400px)
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
