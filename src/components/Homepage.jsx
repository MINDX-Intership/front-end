import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid, Avatar, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#065f46',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '4px solid',
          borderColor: '#065f46',
        },
      },
    },
  },
});

function Homepage() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 240, sm: 320, md: 384 },
            backgroundImage: "url('https://i.pinimg.com/736x/c2/e9/02/c2e902e031e1d9d932411dd0b8ab5eef.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 2,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            boxShadow: 3,
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }} />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              position: 'relative',
              fontWeight: 'extrabold',
              textAlign: 'center',
              lineHeight: 'tight',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            }}
          >
            hello world
          </Typography>
        </Box>

        <Container maxWidth="md" sx={{ mt: -6, mb: 8, zIndex: 10, position: 'relative' }}>
          <Box
            sx={{
              py: 8,
              backgroundColor: 'white',
              boxShadow: 2,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53uEHLBvKUNSXlML1Qa_qgRLcGc2fe4hJOA&s"
              alt="Company Logo"
              sx={{ width: { xs: 100, md: 150 }, height: { xs: 100, md: 150 }, objectFit: 'cover', boxShadow: 3 }}
            />
            <Typography variant="h5" component="p" sx={{ mt: 2, fontWeight: 'semibold', color: 'text.primary' }}>
              Nhóm bảy hết sảy
            </Typography>
          </Box>
        </Container>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'text.primary', mb: 5 }}>
            Latest Updates
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <PostCard
                imageSrc="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg"
                title="Hello world"
                detail="Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world."
              />
            </Grid>
            <Grid item xs={12}>
              <PostCard
                imageSrc="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg"
                title="Hello world"
                detail="Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world"
              />
            </Grid>
            <Grid item xs={12}>
              <PostCard
                imageSrc="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2020/02/Usign-Gradients-Featured-Image.jpg"
                title="Hello world"
                detail="Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world"
              />
            </Grid>
          </Grid>
        </Container>


      </Box>
    </ThemeProvider>
  );
}

function PostCard({ imageSrc, title, detail }) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', md: '50%' },
          height: { xs: 192, md: 300 },
          objectFit: 'cover',
          borderTopLeftRadius: { xs: 12, md: 12 },
          borderTopRightRadius: { xs: 12, md: 0 },
          borderBottomLeftRadius: { xs: 0, md: 12 },
        }}
        image={imageSrc}
        alt={title}
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/333333?text=Image+Error'; }}
      />
      <CardContent
        sx={{
          width: { xs: '100%', md: '50%' },
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1.5 }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 'relaxed' }}>
          {detail}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, alignSelf: 'flex-start', px: 3, py: 1.5 }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

export default Homepage;