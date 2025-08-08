import React from 'react';
import { Box, Paper, Typography, Button, TextField, IconButton, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { keyframes } from '@emotion/react';

// subtle float animation for the illustration
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const Root = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: '48px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(1200px 600px at 10% 20%, rgba(118,75,162,0.06), transparent), radial-gradient(900px 400px at 90% 80%, rgba(102,126,234,0.06), transparent)',
}));

const Card = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 1050,
  borderRadius: 18,
  overflow: 'hidden',
  display: 'flex',
  boxShadow: '0 12px 40px rgba(16,24,40,0.12)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.9))',
}));

const Left = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '52px 44px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const Right = styled(Box)(({ theme }) => ({
  width: 420,
  minHeight: 360,
  background: 'linear-gradient(135deg, #6b7cff 0%, #8e6bcd 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 28,
  flexDirection: 'column',
}));

const Code = styled(Typography)(({ theme }) => ({
  fontSize: 84,
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: -6,
  color: theme.palette.error.main,
  marginBottom: 6,
}));

const Headline = styled(Typography)(({ theme }) => ({
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 6,
}));

const Sub = styled(Typography)(({ theme }) => ({
  color: '#6c757d',
  marginBottom: 18,
}));

const ActionRow = styled(Box)(() => ({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  marginTop: 8,
  flexWrap: 'wrap',
}));

const Primary = styled(Button)(() => ({
  borderRadius: 12,
  padding: '10px 18px',
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(102,126,234,0.18)',
}));

const Secondary = styled(Button)(() => ({
  borderRadius: 12,
  padding: '10px 16px',
  textTransform: 'none',
}));

const SearchForm = styled('form')(() => ({
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  marginTop: 12,
}));

const Illustration = styled('div')(() => ({
  width: 220,
  height: 220,
  borderRadius: 16,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 56,
  animation: `${float} 4s ease-in-out infinite`,
  boxShadow: 'inset 0 -10px 40px rgba(255,255,255,0.02), 0 8px 26px rgba(17,24,39,0.12)'
}));

const SmallHint = styled(Typography)(() => ({
  color: 'rgba(255,255,255,0.9)',
  textAlign: 'center',
  marginTop: 8,
  fontSize: 14,
}));

const NotFoundPage = ({ setCurrentPage, homePath = '/' }) => {
  const handleGoHome = () => {
    if (typeof setCurrentPage === 'function') {
      setCurrentPage(homePath);
      return;
    }
    window.location.href = homePath || '/';
  };

  const handleReport = () => {
    window.location.href = 'mailto:admin@example.com?subject=[Bug]%20404%20Not%20Found&body=Mình%20gặp%20lỗi%20404%20ở%20URL:%20' + encodeURIComponent(window.location.href);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input')?.value?.trim();
    if (!q) return;
    const searchPath = `/search?q=${encodeURIComponent(q)}`;
    if (typeof setCurrentPage === 'function') setCurrentPage(searchPath);
    else window.location.href = searchPath;
  };

  return (
    <Root>
      <Card elevation={0}>
        <Left>
          <Code>404</Code>
          <Headline variant="h3">Trang bạn tìm kiếm không tồn tại</Headline>
          <Sub>
            Có thể đường dẫn đã bị đổi tên, xóa hoặc bạn gõ sai URL. Thử một trong những cách dưới đây để tiếp tục.
          </Sub>

          <ActionRow>
            <Primary variant="contained" startIcon={<HomeIcon />} onClick={handleGoHome}>
              Quay về trang chủ
            </Primary>

            <Secondary variant="outlined" startIcon={<ReportProblemIcon />} onClick={handleReport}>
              Báo lỗi
            </Secondary>

            <Secondary
              variant="outlined"
              onClick={() => {
                if (typeof setCurrentPage === 'function') setCurrentPage('/');
                else window.location.href = '/';
              }}
            >
              Trang chính
            </Secondary>
          </ActionRow>

          <SearchForm onSubmit={handleSearch} aria-label="site search">
            <TextField
              name="q"
              placeholder="Tìm trong dự án (ví dụ: tasks, sprints, user...)"
              size="small"
              fullWidth
              sx={{ flex: 1 }}
              inputProps={{ 'aria-label': 'search input' }}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </SearchForm>

          <Typography variant="body2" sx={{ color: '#6c757d', marginTop: 10 }}>
            Mẹo: kiểm tra đường dẫn, hoặc dùng tìm kiếm. Nếu bạn tin đây là lỗi hệ thống, hãy báo cho đội ngũ kỹ thuật.
          </Typography>
        </Left>

        <Right>
          <Illustration aria-hidden>
            {/* Friendly SVG illustration built with simple shapes for clarity */}
            <svg width="130" height="130" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="140" height="140" rx="20" fill="url(#g1)" opacity="0.06" />
              <path d="M80 38 C96 38 110 56 110 78 C110 100 96 118 80 118 C64 118 50 100 50 78 C50 56 64 38 80 38Z" fill="white" opacity="0.14" />
              <path d="M72 64 L88 64 L88 94 L72 94 Z" fill="#6b7cff" />
              <circle cx="80" cy="52" r="6" fill="#8e6bcd" />
            </svg>
          </Illustration>

          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Bị lạc đường? Mình giúp!</Typography>
          <SmallHint>
            Nếu cần, bạn có thể quay về trang chính hoặc báo lỗi — đội ngũ kỹ thuật sẽ xem xét sớm.
          </SmallHint>

          <Button
            variant="contained"
            sx={{ mt: 2, borderRadius: 10, textTransform: 'none' }}
            onClick={handleGoHome}
          >
            Về trang chính
          </Button>
        </Right>
      </Card>
    </Root>
  );
};

export default NotFoundPage;
