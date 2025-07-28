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
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

const Root = styled(Box)({
  minHeight: "100vh",
  background: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
});

const MainContent = styled(Paper)(({ theme }) => ({
  maxWidth: "900px",
  width: "100%",
  borderRadius: "24px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden",
}));

const CoverImage = styled(Box)({
  width: "100%",
  height: "200px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
});

const ProfileHeader = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  gap: "24px",
  padding: "32px",
  marginTop: "-80px",
  position: "relative",
  zIndex: 1,
});

const ProfileAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  border: "6px solid #ffffff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
});

const ProfileName = styled(Typography)({
  fontWeight: 700,
  fontSize: "2rem",
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
});

const UserBio = styled(Typography)({
  color: "#6c757d",
  fontSize: "1.1rem",
  maxWidth: "600px",
  lineHeight: 1.6,
});

const SectionTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 700,
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "24px",
  marginTop: "32px",
});

const FormContainer = styled(Box)({
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#e0e0e0",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f8f9fa",
      "& fieldset": {
        borderColor: "#e9ecef",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6c757d",
    fontSize: "1rem",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "1.1rem",
    padding: "16px 14px",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#6c757d",
    WebkitTextFillColor: "#6c757d",
  },
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "16px",
  justifyContent: "flex-end",
  padding: "0 32px 24px 32px",
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  ...(variant === "contained" && {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
    "&:hover": {
      background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
      boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
      transform: "translateY(-2px)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#667eea",
    color: "#667eea",
    borderWidth: "2px",
    "&:hover": {
      borderColor: "#5a6fd8",
      backgroundColor: "rgba(102, 126, 234, 0.04)",
      borderWidth: "2px",
      transform: "translateY(-2px)",
    },
  }),
}));

const FileUploadArea = styled(Box)({
  border: "2px dashed #667eea",
  borderRadius: "16px",
  padding: "48px 32px",
  textAlign: "center",
  backgroundColor: "rgba(102, 126, 234, 0.04)",
  cursor: "pointer",
  margin: "0 32px 32px 32px",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#5a6fd8",
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    transform: "translateY(-2px)",
  },
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
});

const LoadingContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  padding: "48px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
});

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

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress size={48} sx={{ color: "#667eea" }} />
          <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
            Đang tải hồ sơ...
          </Typography>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (!currentUser) return null;

  return (
    <Root>
      <MainContent elevation={0}>
        <CoverImage />
        <ProfileHeader>
          <ProfileAvatar
            src={currentUser?.avatarUrl || "/static/images/avatar/1.jpg"}
          />
          <Box>
            <ProfileName variant="h4">
              {currentUser?.name || "Người dùng"}
            </ProfileName>
            <UserBio variant="body1">
              {bio || "Chưa có tiểu sử."}
            </UserBio>
          </Box>
        </ProfileHeader>

        <ActionButtons>
          {isEditing ? (
            <>
              <StyledButton variant="contained" onClick={handleSave}>
                Lưu
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleCancel}>
                Hủy
              </StyledButton>
            </>
          ) : (
            <StyledButton variant="contained" onClick={handleEditToggle}>
              Chỉnh sửa hồ sơ
            </StyledButton>
          )}
        </ActionButtons>

        <FormContainer>
          <SectionTitle variant="h5">Thông tin cá nhân</SectionTitle>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Email row */}
            <StyledTextField
              label="Email Cá Nhân"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              disabled={!isEditing}
              type="email"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Name, Phone, DOB, Role row */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Số Điện Thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  type="tel"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Ngày Sinh"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Vai trò"
                  value={role}
                  disabled
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Bio row */}
            <StyledTextField
              label="Tiểu sử"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              multiline
              minRows={3}
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder="Viết một chút về bản thân bạn..."
            />
          </Box>

          <SectionTitle variant="h5">Tải ảnh lên</SectionTitle>
        </FormContainer>

        <FileUploadArea>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "#667eea" }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#667eea", 
                fontWeight: 600,
                marginBottom: 1
              }}
            >
              Nhấp để tải lên hoặc kéo và thả
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#6c757d",
                fontSize: "1rem"
              }}
            >
              SVG, PNG, JPG hoặc GIF (tối đa 800x400px)
            </Typography>
          </Box>
        </FileUploadArea>
      </MainContent>
    </Root>
  );
}

export default SettingPage;